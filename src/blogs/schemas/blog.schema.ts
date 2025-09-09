import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { IsArray, IsBoolean, IsOptional, IsString } from 'class-validator';

export type BlogDocument = Blog & Document;

export enum BlogStatus {
  DRAFT = 'draft',
  PUBLISHED = 'published',
  ARCHIVED = 'archived',
}

@Schema({ timestamps: true })
export class Blog {
  @Prop({ required: true, trim: true })
  @IsString()
  title: string;

  @Prop({ required: true })
  @IsString()
  content: string;

  @Prop({ required: true, trim: true })
  @IsString()
  excerpt: string;

  @Prop({ unique: true }) // no longer required, slug will be auto-generated
  slug: string;

  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  author: Types.ObjectId;

  @Prop({ type: [String], default: [] })
  @IsArray()
  @IsOptional()
  tags: string[];

  @Prop({ type: String, enum: BlogStatus, default: BlogStatus.DRAFT })
  status: BlogStatus;

  @Prop({ default: null })
  @IsOptional()
  @IsString()
  featuredImage?: string;

  @Prop({ type: [{ type: Types.ObjectId, ref: 'User' }], default: [] })
  likes: Types.ObjectId[];

  @Prop({ default: 0 })
  viewCount: number;

  @Prop({ default: 0 })
  readTime: number; // in minutes

  @Prop({ type: [String], default: [] })
  @IsArray()
  @IsOptional()
  categories: string[];

  @Prop({ default: true })
  @IsBoolean()
  allowComments: boolean;

  @Prop({ default: false })
  @IsBoolean()
  isPinned: boolean;

  @Prop({ default: null })
  publishedAt?: Date;

  @Prop({
    type: {
      title: String,
      description: String,
      keywords: [String],
    },
    default: null,
  })
  seo?: {
    title: string;
    description: string;
    keywords: string[];
  };
}

export const BlogSchema = SchemaFactory.createForClass(Blog);

BlogSchema.virtual('comments', {
  ref: 'Comment',           // The model to use
  localField: '_id',        // Blog _id
  foreignField: 'blog',     // Comment.blog
});

// Make sure virtuals are included in JSON output
BlogSchema.set('toObject', { virtuals: true });
BlogSchema.set('toJSON', { virtuals: true });

// Indexes for better performance
BlogSchema.index({ author: 1 });
BlogSchema.index({ status: 1 });
BlogSchema.index({ tags: 1 });
BlogSchema.index({ categories: 1 });
BlogSchema.index({ slug: 1 });
BlogSchema.index({ createdAt: -1 });
BlogSchema.index({ likes: 1 });
BlogSchema.index({ title: 'text', content: 'text', excerpt: 'text' });

// Pre-save middleware to generate slug and calculate read time
BlogSchema.pre('save', function (next) {
  // Always generate slug if missing
  if (!this.slug && this.title) {
    this.slug = this.title
      .toLowerCase()
      .replace(/[^a-zA-Z0-9 ]/g, '') // remove special chars
      .replace(/\s+/g, '-') // replace spaces with dashes
      .substring(0, 100);
  }

  // Auto-calculate read time from content
  if (this.isModified('content')) {
    const wordCount = this.content.split(/\s+/).length;
    this.readTime = Math.ceil(wordCount / 200); // ~200 words per minute
  }

  // Set publishedAt when status changes to PUBLISHED
  if (this.status === BlogStatus.PUBLISHED && !this.publishedAt) {
    this.publishedAt = new Date();
  }

  next();
});

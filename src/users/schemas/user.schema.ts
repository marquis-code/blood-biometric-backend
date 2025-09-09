import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { IsEmail, IsEnum, IsOptional, IsString } from 'class-validator';

export type UserDocument = User & Document;

export enum UserRole {
  USER = 'user',
  ADMIN = 'admin',
}

@Schema({ timestamps: true })
export class User {
  @Prop({ required: true, trim: true })
  @IsString()
  firstName: string;

  @Prop({ required: true, trim: true })
  @IsString()
  lastName: string;

  @Prop({ required: true, unique: true, lowercase: true })
  @IsEmail()
  email: string;

  @Prop({ required: true })
  password: string;

  @Prop({ type: String, enum: UserRole, default: UserRole.USER })
  @IsEnum(UserRole)
  role: UserRole;

  @Prop({ default: null })
  @IsOptional()
  @IsString()
  avatar?: string;

  @Prop({ default: null })
  @IsOptional()
  @IsString()
  bio?: string;

  @Prop({ default: true })
  isActive: boolean;

  @Prop({ default: Date.now })
  lastLogin: Date;

  @Prop({ type: [{ type: String }], default: [] })
  following: string[];

  @Prop({ type: [{ type: String }], default: [] })
  followers: string[];
}

export const UserSchema = SchemaFactory.createForClass(User);

// Index for better performance
UserSchema.index({ email: 1 });
UserSchema.index({ role: 1 });
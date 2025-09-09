import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Blog, BlogDocument, BlogStatus } from './schemas/blog.schema';
import { CreateBlogDto } from './dto/create-blog.dto';
import { UpdateBlogDto } from './dto/update-blog.dto';
import { UserRole } from '../users/schemas/user.schema';

@Injectable()
export class BlogsService {
  constructor(
    @InjectModel(Blog.name) private blogModel: Model<BlogDocument>,
  ) {}

  async create(createBlogDto: CreateBlogDto, authorId: string): Promise<BlogDocument> {
    const createdBlog = new this.blogModel({
      ...createBlogDto,
      author: authorId,
    });
    return createdBlog.save();
  }

  async findAll(query: any = {}): Promise<{
    blogs: BlogDocument[];
    total: number;
    page: number;
    totalPages: number;
  }> {
    const {
      page = 1,
      limit = 10,
      search,
      category,
      tag,
      author,
      status = BlogStatus.PUBLISHED,
      sortBy = 'createdAt',
      sortOrder = 'desc',
    } = query;

    const filter: any = { status };

    if (search) {
      filter.$text = { $search: search };
    }

    if (category) {
      filter.categories = { $in: [category] };
    }

    if (tag) {
      filter.tags = { $in: [tag] };
    }

    if (author) {
      filter.author = author;
    }

    const skip = (page - 1) * limit;
    const sort = { [sortBy]: sortOrder === 'desc' ? -1 : 1 } as any

    const [blogs, total] = await Promise.all([
      this.blogModel
        .find(filter)
        .sort(sort)
        .skip(skip)
        .limit(parseInt(limit))
        .populate({
            path: 'comments',
            populate: {
              path: 'author', // if your Comment schema has an author field
              select: 'firstName lastName email avatar',
            },
          })
        .populate('author', 'firstName lastName email avatar')
        .exec(),
      this.blogModel.countDocuments(filter),
    ]);

    return {
      blogs,
      total,
      page: parseInt(page),
      totalPages: Math.ceil(total / limit),
    };
  }

  async findBySlug(slug: string): Promise<BlogDocument> {
    const blog = await this.blogModel
      .findOneAndUpdate(
        { slug, status: BlogStatus.PUBLISHED },
        { $inc: { viewCount: 1 } },
        { new: true },
      )
      .populate('author', 'firstName lastName email avatar bio')
      .populate({
      path: 'comments',
      populate: { path: 'author', select: 'firstName lastName avatar' }, // also load comment authors
    })
      .exec();

    if (!blog) {
      throw new NotFoundException('Blog not found');
    }

    return blog;
  }

  async findById(id: string): Promise<BlogDocument> {
    const blog = await this.blogModel
      .findById(id)
      .populate('author', 'firstName lastName email avatar')
      .populate({
      path: 'comments',
      populate: { path: 'author', select: 'firstName lastName avatar' },
    })
      .exec();

    if (!blog) {
      throw new NotFoundException('Blog not found');
    }

    return blog;
  }

  async update(
    id: string,
    updateBlogDto: UpdateBlogDto,
    userId: string,
    userRole: string,
  ): Promise<BlogDocument> {
    const blog = await this.findById(id);

    if (blog.author.toString() !== userId && userRole !== UserRole.ADMIN) {
      throw new ForbiddenException('You can only update your own blogs');
    }

    Object.assign(blog, updateBlogDto);
    return blog.save();
  }

  async remove(id: string, userId: string, userRole: string): Promise<void> {
    const blog = await this.findById(id);

    if (blog.author.toString() !== userId && userRole !== UserRole.ADMIN) {
      throw new ForbiddenException('You can only delete your own blogs');
    }

    await this.blogModel.findByIdAndDelete(id);
  }

  async likeBlog(blogId: string, userId: string): Promise<BlogDocument> {
    const blog = await this.blogModel.findByIdAndUpdate(
      blogId,
      { $addToSet: { likes: userId } },
      { new: true },
    );

    if (!blog) {
      throw new NotFoundException('Blog not found');
    }

    return blog;
  }

  async unlikeBlog(blogId: string, userId: string): Promise<BlogDocument> {
    const blog = await this.blogModel.findByIdAndUpdate(
      blogId,
      { $pull: { likes: userId } },
      { new: true },
    );

    if (!blog) {
      throw new NotFoundException('Blog not found');
    }

    return blog;
  }

  async getTrendingBlogs(): Promise<BlogDocument[]> {
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    return this.blogModel
      .find({
        status: BlogStatus.PUBLISHED,
        createdAt: { $gte: thirtyDaysAgo },
      })
      .sort({ viewCount: -1, likes: -1 })
      .limit(10)
      .populate('author', 'firstName lastName avatar')
      .exec();
  }

  async getFeaturedBlogs(): Promise<BlogDocument[]> {
    return this.blogModel
      .find({ status: BlogStatus.PUBLISHED, isPinned: true })
      .sort({ createdAt: -1 })
      .limit(5)
      .populate('author', 'firstName lastName avatar')
      .exec();
  }

  async getBlogsByAuthor(authorId: string): Promise<BlogDocument[]> {
    return this.blogModel
      .find({ author: authorId, status: BlogStatus.PUBLISHED })
      .sort({ createdAt: -1 })
      .populate('author', 'firstName lastName avatar')
      .exec();
  }
}
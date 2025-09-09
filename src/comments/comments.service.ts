import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Comment, CommentDocument } from './schemas/comment.schema';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UserRole } from '../users/schemas/user.schema';

@Injectable()
export class CommentsService {
  constructor(
    @InjectModel(Comment.name) private commentModel: Model<CommentDocument>,
  ) {}

  async create(createCommentDto: CreateCommentDto, authorId: string): Promise<CommentDocument> {
    const comment = new this.commentModel({
      ...createCommentDto,
      author: authorId,
    });

    const savedComment = await comment.save();

    // If it's a reply, add it to parent's replies array
    if (createCommentDto.parentComment) {
      await this.commentModel.findByIdAndUpdate(createCommentDto.parentComment, {
        $push: { replies: savedComment._id },
      });
    }

    return savedComment;
  }

  async findByBlog(blogId: string): Promise<CommentDocument[]> {
    return this.commentModel
      .find({ blog: blogId, isActive: true, parentComment: null })
      .populate('author', 'firstName lastName avatar')
      .populate({
        path: 'replies',
        populate: {
          path: 'author',
          select: 'firstName lastName avatar',
        },
      })
      .sort({ createdAt: -1 })
      .exec();
  }

  async findById(id: string): Promise<CommentDocument> {
    const comment = await this.commentModel
      .findById(id)
      .populate('author', 'firstName lastName avatar')
      .exec();

    if (!comment) {
      throw new NotFoundException('Comment not found');
    }

    return comment;
  }

  async update(
    id: string,
    content: string,
    userId: string,
    userRole: string,
  ): Promise<CommentDocument> {
    const comment = await this.findById(id);

    if (comment.author._id.toString() !== userId && userRole !== UserRole.ADMIN) {
      throw new ForbiddenException('You can only update your own comments');
    }

    comment.content = content;
    comment.isEdited = true;
    return comment.save();
  }

  async remove(id: string, userId: string, userRole: string): Promise<void> {
    const comment = await this.findById(id);

    if (comment.author._id.toString() !== userId && userRole !== UserRole.ADMIN) {
      throw new ForbiddenException('You can only delete your own comments');
    }

    // Soft delete
    comment.isActive = false;
    await comment.save();
  }

  async likeComment(commentId: string, userId: string): Promise<CommentDocument> {
    const comment = await this.commentModel.findByIdAndUpdate(
      commentId,
      { $addToSet: { likes: userId } },
      { new: true },
    );

    if (!comment) {
      throw new NotFoundException('Comment not found');
    }

    return comment;
  }

  async unlikeComment(commentId: string, userId: string): Promise<CommentDocument> {
    const comment = await this.commentModel.findByIdAndUpdate(
      commentId,
      { $pull: { likes: userId } },
      { new: true },
    );

    if (!comment) {
      throw new NotFoundException('Comment not found');
    }

    return comment;
  }

  async getReplies(commentId: string): Promise<CommentDocument[]> {
    return this.commentModel
      .find({ parentComment: commentId, isActive: true })
      .populate('author', 'firstName lastName avatar')
      .sort({ createdAt: 1 })
      .exec();
  }
}
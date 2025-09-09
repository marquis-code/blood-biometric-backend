import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Request,
  Req
} from '@nestjs/common';
import { CommentsService } from './comments.service';
import { CreateCommentDto } from './dto/create-comment.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('comments')
export class CommentsController {
  constructor(private readonly commentsService: CommentsService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  create(@Body() createCommentDto: CreateCommentDto, @Request() req) {
    return this.commentsService.create(createCommentDto, req.user._id);
  }

@UseGuards(JwtAuthGuard)
@Post(':blogId/comments')
async createComment(
  @Param('blogId') blogId: string,
  @Body() createCommentDto: CreateCommentDto,
  @Req() req
) {
  return this.commentsService.create(
    { ...createCommentDto, blog: blogId },
    req.user._id, // ✅ now req.user is guaranteed
  );
}



  @Get('blog/:blogId')
  findByBlog(@Param('blogId') blogId: string) {
    return this.commentsService.findByBlog(blogId);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.commentsService.findById(id);
  }

  @Get(':id/replies')
  getReplies(@Param('id') id: string) {
    return this.commentsService.getReplies(id);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  update(@Param('id') id: string, @Body('content') content: string, @Request() req) {
    return this.commentsService.update(id, content, req.user._id, req.user.role);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  remove(@Param('id') id: string, @Request() req) {
    return this.commentsService.remove(id, req.user._id, req.user.role);
  }

  @UseGuards(JwtAuthGuard)
  @Post(':id/like')
  likeComment(@Param('id') id: string, @Request() req) {
    return this.commentsService.likeComment(id, req.user._id);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id/like')
  unlikeComment(@Param('id') id: string, @Request() req) {
    return this.commentsService.unlikeComment(id, req.user._id);
  }
}
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
  Query,
  Req,
  ParseIntPipe,
} from '@nestjs/common';
import { BlogsService } from './blogs.service';
import { CreateBlogDto } from './dto/create-blog.dto';
import { UpdateBlogDto } from './dto/update-blog.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { AdminGuard } from '../auth/guards/admin.guard';

@Controller('blogs')
export class BlogsController {
  constructor(private readonly blogsService: BlogsService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  create(@Body() createBlogDto: CreateBlogDto, @Request() req) {
    return this.blogsService.create(createBlogDto, req.user._id);
  }

  @Get()
  findAll(@Query() query: any) {
    return this.blogsService.findAll(query);
  }

  @Get('trending')
  getTrending() {
    return this.blogsService.getTrendingBlogs();
  }

  @Get('featured')
  getFeatured() {
    return this.blogsService.getFeaturedBlogs();
  }

  @Get('author/:authorId')
  getByAuthor(@Param('authorId') authorId: string) {
    return this.blogsService.getBlogsByAuthor(authorId);
  }

  @Get('slug/:slug')
  findBySlug(@Param('slug') slug: string) {
    return this.blogsService.findBySlug(slug);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.blogsService.findById(id);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateBlogDto: UpdateBlogDto, @Request() req) {
    return this.blogsService.update(id, updateBlogDto, req.user._id, req.user.role);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  remove(@Param('id') id: string, @Request() req) {
    return this.blogsService.remove(id, req.user._id, req.user.role);
  }

  @UseGuards(JwtAuthGuard)
  @Post(':id/like')
  likeBlog(@Param('id') id: string, @Request() req) {
    return this.blogsService.likeBlog(id, req.user._id);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id/like')
  unlikeBlog(@Param('id') id: string, @Request() req) {
    return this.blogsService.unlikeBlog(id, req.user._id);
  }

  // Admin routes
  @UseGuards(JwtAuthGuard, AdminGuard)
  @Get('admin/all')
  findAllAdmin(@Query() query: any) {
    return this.blogsService.findAll({ ...query, includeAll: true });
  }

  @UseGuards(JwtAuthGuard, AdminGuard)
  @Patch('admin/:id/pin')
  pinBlog(@Param('id') id: string) {
    return this.blogsService.update(id, { isPinned: true }, null, 'admin');
  }

  @UseGuards(JwtAuthGuard, AdminGuard)
  @Patch('admin/:id/unpin')
  unpinBlog(@Param('id') id: string) {
    return this.blogsService.update(id, { isPinned: false }, null, 'admin');
  }
}
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
} from '@nestjs/common';
import { UsersService } from './users.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { AdminGuard } from '../auth/guards/admin.guard';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @UseGuards(JwtAuthGuard, AdminGuard)
  @Get()
  findAll() {
    return this.usersService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.usersService.findById(id);
  }

  @UseGuards(JwtAuthGuard)
  @Post(':id/follow')
  followUser(@Param('id') id: string, @Request() req) {
    return this.usersService.followUser(req.user._id, id);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id/follow')
  unfollowUser(@Param('id') id: string, @Request() req) {
    return this.usersService.unfollowUser(req.user._id, id);
  }

  @UseGuards(JwtAuthGuard, AdminGuard)
  @Delete(':id')
  deactivateUser(@Param('id') id: string) {
    return this.usersService.deactivateUser(id);
  }
}
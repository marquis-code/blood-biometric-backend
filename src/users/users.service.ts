import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from './schemas/user.schema';
import { CreateUserDto } from './dto/create-user.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<UserDocument> {
    const createdUser = new this.userModel(createUserDto);
    return createdUser.save();
  }

  async findAll(): Promise<UserDocument[]> {
    return this.userModel.find({ isActive: true }).select('-password').exec();
  }

  async findById(id: string): Promise<UserDocument> {
    const user = await this.userModel.findById(id).select('-password').exec();
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }

  async findByEmail(email: string): Promise<UserDocument> {
    return this.userModel.findOne({ email, isActive: true }).exec();
  }

  async updateLastLogin(id: string): Promise<void> {
    await this.userModel.findByIdAndUpdate(id, { lastLogin: new Date() });
  }

  async followUser(followerId: string, followingId: string): Promise<void> {
    await this.userModel.findByIdAndUpdate(followerId, {
      $addToSet: { following: followingId },
    });
    await this.userModel.findByIdAndUpdate(followingId, {
      $addToSet: { followers: followerId },
    });
  }

  async unfollowUser(followerId: string, followingId: string): Promise<void> {
    await this.userModel.findByIdAndUpdate(followerId, {
      $pull: { following: followingId },
    });
    await this.userModel.findByIdAndUpdate(followingId, {
      $pull: { followers: followerId },
    });
  }

  async deactivateUser(id: string): Promise<void> {
    await this.userModel.findByIdAndUpdate(id, { isActive: false });
  }
}
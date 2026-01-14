import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';
import { User, UserDocument } from './schemas/user.schema';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    const existingUser = await this.userModel.findOne({ email: createUserDto.email });
    
    if (existingUser) {
      throw new ConflictException('User with this email already exists');
    }

    if (createUserDto.password) {
      const hashedPassword = await bcrypt.hash(createUserDto.password, 10);
      createUserDto.password = hashedPassword;
    }

    const createdUser = new this.userModel(createUserDto);
    return createdUser.save();
  }

  async findAll(): Promise<User[]> {
    return this.userModel.find({ isActive: true }).select('-password').exec();
  }

  async findOne(id: string): Promise<User> {
    const user = await this.userModel.findById(id).select('-password').exec();
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }

  async findByEmail(email: string): Promise<UserDocument> {
    return this.userModel.findOne({ email, isActive: true }).exec();
  }

  async findByGoogleId(googleId: string): Promise<UserDocument> {
    return this.userModel.findOne({ googleId, isActive: true }).exec();
  }

  async update(id: string, updateUserDto: UpdateUserDto): Promise<User> {
    const updatedUser = await this.userModel
      .findByIdAndUpdate(id, updateUserDto, { new: true })
      .select('-password')
      .exec();
      
    if (!updatedUser) {
      throw new NotFoundException('User not found');
    }
    
    return updatedUser;
  }

  async remove(id: string): Promise<void> {
    const result = await this.userModel.findByIdAndUpdate(
      id,
      { isActive: false },
      { new: true }
    ).exec();
    
    if (!result) {
      throw new NotFoundException('User not found');
    }
  }

  async updatePassword(id: string, newPassword: string): Promise<void> {
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await this.userModel.findByIdAndUpdate(id, { password: hashedPassword }).exec();
  }

  async verifyUser(id: string): Promise<void> {
    await this.userModel.findByIdAndUpdate(id, { 
      isVerified: true,
      verificationToken: null 
    }).exec();
  }

  async setResetPasswordToken(email: string, token: string): Promise<void> {
    await this.userModel.findOneAndUpdate(
      { email },
      {
        resetPasswordToken: token,
        resetPasswordExpires: new Date(Date.now() + 3600000) // 1 hour
      }
    ).exec();
  }
}
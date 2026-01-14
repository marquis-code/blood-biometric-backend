import { Injectable, UnauthorizedException, ConflictException, BadRequestException, InternalServerErrorException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UsersService } from '../users/users.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { JwtPayload } from '../../common/interfaces/jwt-payload.interface';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async register(registerDto: RegisterDto) {
    try {
      const user = await this.usersService.create({
        ...registerDto,
        role: registerDto.role || 'patient',
      });

      // Send welcome email
      // await this.notificationsService.sendWelcomeEmail(user.email, user.firstName);

      const payload: JwtPayload = { 
        sub: user._id.toString(), 
        email: user.email, 
        role: user.role 
      };

      return {
        access_token: this.jwtService.sign(payload),
        user: {
          id: user._id,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          role: user.role,
        },
      };
    } catch (error) {
      if (error instanceof ConflictException) {
        throw error;
      }
      
      // Handle different types of errors appropriately
      if (error instanceof BadRequestException) {
        throw error;
      }
      
      // Log the actual error for debugging
      console.error('Registration error:', error);
      
      // Throw a proper NestJS exception instead of generic Error
      throw new InternalServerErrorException('Registration failed');
    }
  }

  async login(loginDto: LoginDto) {
    const user = await this.usersService.findByEmail(loginDto.email);
    
    if (!user || !user.password) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isPasswordValid = await bcrypt.compare(loginDto.password, user.password);
    
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const payload: JwtPayload = { 
      sub: user._id.toString(), 
      email: user.email, 
      role: user.role 
    };

    return {
      access_token: this.jwtService.sign(payload),
      user: {
        id: user._id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
      },
    };
  }

  async validateGoogleUser(googleUser: any) {
    let user = await this.usersService.findByGoogleId(googleUser.googleId);
    
    if (!user) {
      user = await this.usersService.findByEmail(googleUser.email);
      
      if (user) {
        // Link Google account to existing user
        await this.usersService.update(user._id.toString(), { googleId: googleUser.googleId });
        user.googleId = googleUser.googleId;
      } else {
        // Create new user
        user = await this.usersService.create({
          ...googleUser,
          role: 'patient',
          isVerified: true,
        });
      }
    }

    const payload: JwtPayload = { 
      sub: user._id.toString(), 
      email: user.email, 
      role: user.role 
    };

    return {
      access_token: this.jwtService.sign(payload),
      user: {
        id: user._id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
      },
    };
  }

  async forgotPassword(email: string): Promise<{ message: string }> {
    const user = await this.usersService.findByEmail(email);
    
    if (!user) {
      // Don't reveal that user doesn't exist
      return { message: 'If an account exists, a password reset email has been sent.' };
    }

    const resetToken = this.jwtService.sign(
      { sub: user._id.toString(), type: 'password-reset' },
      { expiresIn: '1h' }
    );

    await this.usersService.setResetPasswordToken(email, resetToken);

    return { message: 'If an account exists, a password reset email has been sent.' };
  }

  async resetPassword(token: string, newPassword: string): Promise<{ message: string }> {
    try {
      const payload = this.jwtService.verify(token);
      
      if (payload.type !== 'password-reset') {
        throw new UnauthorizedException('Invalid token');
      }

      await this.usersService.updatePassword(payload.sub, newPassword);
      
      return { message: 'Password has been reset successfully' };
    } catch (error) {
      throw new UnauthorizedException('Invalid or expired token');
    }
  }
}
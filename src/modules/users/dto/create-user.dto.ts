import { IsEmail, IsNotEmpty, IsOptional, IsEnum, IsString, MinLength, IsDateString, IsPhoneNumber } from 'class-validator';

export class CreateUserDto {
  @IsNotEmpty()
  @IsString()
  firstName: string;

  @IsNotEmpty()
  @IsString()
  lastName: string;

  @IsEmail()
  email: string;

  @IsNotEmpty()
  @MinLength(6)
  password: string;

  @IsOptional()
  @IsPhoneNumber()
  phone?: string;

  @IsOptional()
  @IsDateString()
  dateOfBirth?: Date;

  @IsOptional()
  @IsEnum(['male', 'female', 'other'])
  gender?: string;

  @IsOptional()
  @IsEnum(['patient', 'doctor', 'admin'])
  role?: string;

  @IsOptional()
  profileImage?: string;

  @IsOptional()
  address?: {
    street: string;
    city: string;
    state: string;
    country: string;
    zipCode: string;
  };

  @IsOptional()
  medicalHistory?: string[];

  @IsOptional()
  googleId?: string;
}
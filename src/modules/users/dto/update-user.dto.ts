// import { IsOptional, IsString, IsDateString, IsEnum, IsPhoneNumber } from 'class-validator';

// export class UpdateUserDto {
//   @IsOptional()
//   @IsString()
//   firstName?: string;

//   @IsOptional()
//   @IsString()
//   lastName?: string;

//   @IsOptional()
//   @IsPhoneNumber()
//   phone?: string;

//   @IsOptional()
//   @IsDateString()
//   dateOfBirth?: Date;

//   @IsOptional()
//   @IsEnum(['male', 'female', 'other'])
//   gender?: string;

//   @IsOptional()
//   profileImage?: string;

//   @IsOptional()
//   address?: {
//     street: string;
//     city: string;
//     state: string;
//     country: string;
//     zipCode: string;
//   };

//   @IsOptional()
//   medicalHistory?: string[];
// }


import { IsEmail, IsOptional, IsString, IsEnum } from 'class-validator';

export class UpdateUserDto {
  @IsOptional()
  @IsString()
  firstName?: string;

  @IsOptional()
  @IsString()
  lastName?: string;

  @IsOptional()
  @IsEmail()
  email?: string;

  @IsOptional()
  @IsString()
  password?: string;

  @IsOptional()
  @IsEnum(['patient', 'doctor'])
  role?: string;

  // ✅ allow googleId to be updated
  @IsOptional()
  @IsString()
  googleId?: string;

  @IsOptional()
  isVerified?: boolean;
}

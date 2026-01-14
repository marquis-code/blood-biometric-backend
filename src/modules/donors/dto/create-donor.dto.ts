import { IsString, IsEmail, IsOptional } from 'class-validator';

export class CreateDonorDto {
  @IsString()
  firstName: string;

  @IsString()
  lastName: string;

  @IsEmail()
  email: string;

  @IsString()
  phone: string;

  @IsString()
  dateOfBirth: string;

  @IsString()
  bloodType: string;

  @IsString()
  gender: string;

  @IsString()
  address: string;

  @IsString()
  credentialId: string;

  @IsString()
  publicKey: string;

  @IsString()
  @IsOptional()
  medicalNotes?: string;
}
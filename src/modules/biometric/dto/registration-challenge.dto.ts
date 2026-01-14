import { IsString, IsEmail } from 'class-validator';

export class RegistrationChallengeDto {
  @IsString()
  userId: string;

  @IsString()
  userName: string;

  @IsEmail()
  userEmail: string;
}
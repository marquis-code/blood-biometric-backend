import { IsString } from 'class-validator';

export class VerifyRegistrationDto {
  @IsString()
  userId: string;

  @IsString()
  credentialId: string;

  @IsString()
  publicKey: string;

  @IsString()
  attestationObject: string;

  @IsString()
  clientDataJSON: string;

  @IsString()
  challenge: string;
}
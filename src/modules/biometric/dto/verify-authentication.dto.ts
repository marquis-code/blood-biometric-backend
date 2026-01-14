import { IsString } from 'class-validator';

export class VerifyAuthenticationDto {
  @IsString()
  credentialId: string;

  @IsString()
  authenticatorData: string;

  @IsString()
  clientDataJSON: string;

  @IsString()
  signature: string;

  @IsString()
  challenge: string;
}
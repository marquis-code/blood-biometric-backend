import { Controller, Post, Get, Body } from '@nestjs/common';
import { BiometricService } from './biometric.service';
import { RegistrationChallengeDto } from './dto/registration-challenge.dto';
import { VerifyRegistrationDto } from './dto/verify-registration.dto';
import { VerifyAuthenticationDto } from './dto/verify-authentication.dto';

@Controller('api/biometric')
export class BiometricController {
  constructor(private readonly biometricService: BiometricService) {}

  @Post('registration-challenge')
  async getRegistrationChallenge(@Body() dto: RegistrationChallengeDto) {
    return await this.biometricService.createRegistrationChallenge(
      dto.userId,
      dto.userName,
      dto.userEmail,
    );
  }

  @Post('verify-registration')
  async verifyRegistration(@Body() dto: VerifyRegistrationDto) {
    return await this.biometricService.verifyRegistration(
      dto.userId,
      dto.credentialId,
      dto.publicKey,
      dto.attestationObject,
      dto.clientDataJSON,
      dto.challenge,
    );
  }

  @Post('authentication-challenge')
  async getAuthenticationChallenge() {
    return await this.biometricService.createAuthenticationChallenge();
  }

  @Post('verify-authentication')
  async verifyAuthentication(@Body() dto: VerifyAuthenticationDto) {
    return await this.biometricService.verifyAuthentication(
      dto.credentialId,
      dto.authenticatorData,
      dto.clientDataJSON,
      dto.signature,
      dto.challenge,
    );
  }

  @Get('get-all-credentials')
  async getAllCredentials() {
    return await this.biometricService.getAllCredentials();
  }
}
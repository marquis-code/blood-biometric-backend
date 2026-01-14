import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Donor, DonorDocument } from '../donors/schemas/donor.schema';
import * as crypto from 'crypto';

@Injectable()
export class BiometricService {
  private challenges: Map<string, { challenge: string; timestamp: number }> = new Map();

  constructor(
    @InjectModel(Donor.name) private donorModel: Model<DonorDocument>,
  ) {
    // Clean up old challenges every 5 minutes
    setInterval(() => this.cleanupChallenges(), 5 * 60 * 1000);
  }

  private cleanupChallenges() {
    const now = Date.now();
    const maxAge = 5 * 60 * 1000; // 5 minutes
    
    for (const [key, value] of this.challenges.entries()) {
      if (now - value.timestamp > maxAge) {
        this.challenges.delete(key);
      }
    }
  }

  private generateChallenge(): string {
    return crypto.randomBytes(32).toString('base64');
  }

  private getRpId(): string {
    // In production, use your actual domain
    return process.env.RP_ID || 'localhost';
  }

  async createRegistrationChallenge(userId: string, userName: string, userEmail: string) {
    const challenge = this.generateChallenge();
    const userIdBase64 = Buffer.from(userId).toString('base64');
    
    // Store challenge
    this.challenges.set(userId, { challenge, timestamp: Date.now() });

    // Get existing credentials to exclude
    const existingDonor = await this.donorModel.findOne({ email: userEmail });
    const excludeCredentials = existingDonor ? [
      {
        id: existingDonor.credentialId,
        type: 'public-key',
      }
    ] : [];

    return {
      challenge,
      userId: userIdBase64,
      rpId: this.getRpId(),
      excludeCredentials,
    };
  }

  async verifyRegistration(
    userId: string,
    credentialId: string,
    publicKey: string,
    attestationObject: string,
    clientDataJSON: string,
    challenge: string,
  ) {
    // Verify challenge
    const storedChallenge = this.challenges.get(userId);
    if (!storedChallenge || storedChallenge.challenge !== challenge) {
      return { success: false, message: 'Invalid challenge' };
    }

    // Remove used challenge
    this.challenges.delete(userId);

    // Check if credential already exists
    const existing = await this.donorModel.findOne({ credentialId });
    if (existing) {
      return { success: false, message: 'Fingerprint already registered' };
    }

    // In production, add proper WebAuthn verification here using @simplewebauthn/server
    
    return { success: true };
  }

  async createAuthenticationChallenge() {
    const challenge = this.generateChallenge();
    const challengeId = crypto.randomBytes(16).toString('hex');
    
    this.challenges.set(challengeId, { challenge, timestamp: Date.now() });

    return {
      challenge,
      challengeId,
      rpId: this.getRpId(),
    };
  }

  async verifyAuthentication(
    credentialId: string,
    authenticatorData: string,
    clientDataJSON: string,
    signature: string,
    challenge: string,
  ) {
    // Find donor by credential ID
    const donor = await this.donorModel.findOne({ credentialId });
    
    if (!donor) {
      return { success: false, message: 'Fingerprint not recognized' };
    }

    // In production, add proper signature verification here using @simplewebauthn/server
    
    return {
      success: true,
      donor: {
        id: donor._id,
        firstName: donor.firstName,
        lastName: donor.lastName,
        email: donor.email,
        phone: donor.phone,
        dateOfBirth: donor.dateOfBirth,
        bloodType: donor.bloodType,
        gender: donor.gender,
        address: donor.address,
        lastDonationDate: donor.lastDonationDate,
        donationHistory: donor.donationHistory,
        medicalNotes: donor.medicalNotes,
        registrationDate: donor.registrationDate,
        credentialId: donor.credentialId,
      },
    };
  }

  // async getAllCredentials() {
  //   const donors = await this.donorModel.find({}, 'credentialId');
  //   const challenge = this.generateChallenge();
  //   const challengeId = crypto.randomBytes(16).toString('hex');
    
  //   this.challenges.set(challengeId, { challenge, timestamp: Date.now() });

  //   return {
  //     credentials: donors.map(d => ({ credentialId: d.credentialId })),
  //     challenge,
  //     challengeId,
  //     rpId: this.getRpId(),
  //   };
  // }
  async getAllCredentials() {
  const donors = await this.donorModel.find({}, 'credentialId').lean();
  const challenge = this.generateChallenge();
  const challengeId = crypto.randomBytes(16).toString('hex');
  
  this.challenges.set(challengeId, { challenge, timestamp: Date.now() });

  return {
    credentials: donors.map((d: any) => ({ credentialId: d.credentialId })),
    challenge,
    challengeId,
    rpId: this.getRpId(),
  };
}
}
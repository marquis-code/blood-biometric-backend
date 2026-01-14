import { Model } from 'mongoose';
import { DonorDocument } from '../donors/schemas/donor.schema';
export declare class BiometricService {
    private donorModel;
    private challenges;
    constructor(donorModel: Model<DonorDocument>);
    private cleanupChallenges;
    private generateChallenge;
    private getRpId;
    createRegistrationChallenge(userId: string, userName: string, userEmail: string): Promise<{
        challenge: string;
        userId: string;
        rpId: string;
        excludeCredentials: {
            id: string;
            type: string;
        }[];
    }>;
    verifyRegistration(userId: string, credentialId: string, publicKey: string, attestationObject: string, clientDataJSON: string, challenge: string): Promise<{
        success: boolean;
        message: string;
    } | {
        success: boolean;
        message?: undefined;
    }>;
    createAuthenticationChallenge(): Promise<{
        challenge: string;
        challengeId: string;
        rpId: string;
    }>;
    verifyAuthentication(credentialId: string, authenticatorData: string, clientDataJSON: string, signature: string, challenge: string): Promise<{
        success: boolean;
        message: string;
        donor?: undefined;
    } | {
        success: boolean;
        donor: {
            id: unknown;
            firstName: string;
            lastName: string;
            email: string;
            phone: string;
            dateOfBirth: string;
            bloodType: string;
            gender: string;
            address: string;
            lastDonationDate: string;
            donationHistory: string[];
            medicalNotes: string;
            registrationDate: Date;
            credentialId: string;
        };
        message?: undefined;
    }>;
    getAllCredentials(): Promise<{
        credentials: {
            credentialId: string;
        }[];
        challenge: string;
        challengeId: string;
        rpId: string;
    }>;
}

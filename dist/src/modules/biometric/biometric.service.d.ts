/// <reference types="mongoose/types/aggregate" />
/// <reference types="mongoose/types/callback" />
/// <reference types="mongoose/types/collection" />
/// <reference types="mongoose/types/connection" />
/// <reference types="mongoose/types/cursor" />
/// <reference types="mongoose/types/document" />
/// <reference types="mongoose/types/error" />
/// <reference types="mongoose/types/expressions" />
/// <reference types="mongoose/types/helpers" />
/// <reference types="mongoose/types/middlewares" />
/// <reference types="mongoose/types/indexes" />
/// <reference types="mongoose/types/models" />
/// <reference types="mongoose/types/mongooseoptions" />
/// <reference types="mongoose/types/pipelinestage" />
/// <reference types="mongoose/types/populate" />
/// <reference types="mongoose/types/query" />
/// <reference types="mongoose/types/schemaoptions" />
/// <reference types="mongoose/types/session" />
/// <reference types="mongoose/types/types" />
/// <reference types="mongoose/types/utility" />
/// <reference types="mongoose/types/validation" />
/// <reference types="mongoose/types/virtuals" />
/// <reference types="mongoose/types/schematypes" />
/// <reference types="mongoose/types/inferschematype" />
/// <reference types="mongoose/types/inferhydrateddoctype" />
/// <reference types="mongoose/types/inferrawdoctype" />
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
            id: import("mongoose").Types.ObjectId;
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
            credentialId: any;
        }[];
        challenge: string;
        challengeId: string;
        rpId: string;
    }>;
}

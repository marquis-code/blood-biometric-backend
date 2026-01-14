import { BiometricService } from './biometric.service';
import { RegistrationChallengeDto } from './dto/registration-challenge.dto';
import { VerifyRegistrationDto } from './dto/verify-registration.dto';
import { VerifyAuthenticationDto } from './dto/verify-authentication.dto';
export declare class BiometricController {
    private readonly biometricService;
    constructor(biometricService: BiometricService);
    getRegistrationChallenge(dto: RegistrationChallengeDto): Promise<{
        challenge: string;
        userId: string;
        rpId: string;
        excludeCredentials: {
            id: string;
            type: string;
        }[];
    }>;
    verifyRegistration(dto: VerifyRegistrationDto): Promise<{
        success: boolean;
        message: string;
    } | {
        success: boolean;
        message?: undefined;
    }>;
    getAuthenticationChallenge(): Promise<{
        challenge: string;
        challengeId: string;
        rpId: string;
    }>;
    verifyAuthentication(dto: VerifyAuthenticationDto): Promise<{
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

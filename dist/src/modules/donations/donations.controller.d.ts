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
/// <reference types="mongoose" />
/// <reference types="mongoose/types/schematypes" />
/// <reference types="mongoose/types/inferschematype" />
/// <reference types="mongoose/types/inferrawdoctype" />
import { DonationsService } from './donations.service';
export declare class DonationsController {
    private readonly donationsService;
    constructor(donationsService: DonationsService);
    recordDonation(body: any): Promise<{
        success: boolean;
        message: string;
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
    }>;
    findAll(): Promise<(import("mongoose").Document<unknown, {}, import("./schemas/donation.schema").DonationDocument, {}> & import("./schemas/donation.schema").Donation & import("mongoose").Document<unknown, any, any, Record<string, any>> & Required<{
        _id: unknown;
    }> & {
        __v: number;
    })[]>;
}

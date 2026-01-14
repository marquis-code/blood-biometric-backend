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
/// <reference types="mongoose/types/inferrawdoctype" />
import { Document, Types } from 'mongoose';
export declare class BankDetails {
    accountName: string;
    accountNumber: string;
    bankName: string;
    routingNumber: string;
}
export declare class ConsultationFee {
    type: string;
    amount: number;
    currency: string;
    isActive: boolean;
}
export type DoctorProfileDocument = DoctorProfile & Document & {
    _id: Types.ObjectId;
};
export declare class DoctorProfile {
    userId: Types.ObjectId;
    licenseNumber: string;
    licenseDocument: string;
    specialties: string[];
    qualifications: string;
    experience: number;
    bio: string;
    isAvailable: boolean;
    languages: string[];
    consultationFees: ConsultationFee[];
    about: string;
    weeklySchedule: {
        day: string;
        startTime: string;
        endTime: string;
        isAvailable: boolean;
    }[];
    stripeConnectId: string;
    availability: Array<{
        day: string;
        slots: Array<{
            startTime: string;
            endTime: string;
            isAvailable: boolean;
        }>;
    }>;
    blackoutDates: Date[];
    verificationStatus: string;
    verifiedAt: Date;
    verifiedBy: Types.ObjectId;
    rejectionReason: string;
    averageRating: number;
    totalReviews: number;
    totalConsultations: number;
    isActive: boolean;
    bankDetails: BankDetails;
}
export declare const DoctorProfileSchema: import("mongoose").Schema<DoctorProfile, import("mongoose").Model<DoctorProfile, any, any, any, Document<unknown, any, DoctorProfile, any> & DoctorProfile & {
    _id: Types.ObjectId;
} & {
    __v: number;
}, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, DoctorProfile, Document<unknown, {}, import("mongoose").FlatRecord<DoctorProfile>, {}> & import("mongoose").FlatRecord<DoctorProfile> & {
    _id: Types.ObjectId;
} & {
    __v: number;
}>;

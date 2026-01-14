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
import { Donor, DonorDocument } from './schemas/donor.schema';
import { CreateDonorDto } from './dto/create-donor.dto';
export declare class DonorsService {
    private donorModel;
    constructor(donorModel: Model<DonorDocument>);
    register(createDonorDto: CreateDonorDto): Promise<{
        success: boolean;
        message: string;
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
            credentialId: string;
            registrationDate: Date;
            lastDonationDate: string;
            donationHistory: string[];
            medicalNotes: string;
        };
    }>;
    findAll(): Promise<(import("mongoose").Document<unknown, {}, import("mongoose").Document<unknown, {}, Donor, {}, import("mongoose").DefaultSchemaOptions> & Donor & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    } & {
        id: string;
    }, {}, import("mongoose").DefaultSchemaOptions> & import("mongoose").Document<unknown, {}, Donor, {}, import("mongoose").DefaultSchemaOptions> & Donor & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    } & {
        id: string;
    } & Required<{
        _id: import("mongoose").Types.ObjectId;
    }>)[]>;
    findById(id: string): Promise<import("mongoose").Document<unknown, {}, import("mongoose").Document<unknown, {}, Donor, {}, import("mongoose").DefaultSchemaOptions> & Donor & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    } & {
        id: string;
    }, {}, import("mongoose").DefaultSchemaOptions> & import("mongoose").Document<unknown, {}, Donor, {}, import("mongoose").DefaultSchemaOptions> & Donor & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    } & {
        id: string;
    } & Required<{
        _id: import("mongoose").Types.ObjectId;
    }>>;
}

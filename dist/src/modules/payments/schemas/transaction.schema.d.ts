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
export interface TransactionMetadata {
    consultationType?: string;
    paymentMethod?: string;
    customerIP?: string;
    userAgent?: string;
    sessionId?: string;
    [key: string]: any;
}
export type TransactionDocument = Transaction & Document;
export declare class Transaction {
    patientId: Types.ObjectId;
    doctorId: Types.ObjectId;
    appointmentId: Types.ObjectId;
    amount: number;
    currency: string;
    stripePaymentIntentId: string;
    status: string;
    platformFee: number;
    doctorEarnings: number;
    doctorPaid: boolean;
    doctorPayoutId: string;
    refundId: string;
    refundAmount: number;
    failureReason: string;
    metadata: TransactionMetadata;
}
export declare const TransactionSchema: import("mongoose").Schema<Transaction, import("mongoose").Model<Transaction, any, any, any, Document<unknown, any, Transaction, any> & Transaction & {
    _id: Types.ObjectId;
} & {
    __v: number;
}, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, Transaction, Document<unknown, {}, import("mongoose").FlatRecord<Transaction>, {}> & import("mongoose").FlatRecord<Transaction> & {
    _id: Types.ObjectId;
} & {
    __v: number;
}>;

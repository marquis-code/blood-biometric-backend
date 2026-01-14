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
export type AppointmentDocument = Appointment & Document;
export declare class Appointment {
    patientId: Types.ObjectId;
    doctorId: Types.ObjectId;
    appointmentDate: Date;
    startTime: string;
    endTime: string;
    status: string;
    isPaid: boolean;
    paymentId: string;
    paidAt: Date;
    amount: number;
    notes: string;
    cancelReason: string;
    cancelledAt: Date;
    cancelledBy: Types.ObjectId;
    consultationType: string;
    reason: string;
    prescription: string;
    consultationFee: number;
    meetingLink: string;
    chatRoomId: string;
    cancellationReason: string;
    refundIssued: boolean;
    refundAmount: number;
}
export declare const AppointmentSchema: import("mongoose").Schema<Appointment, import("mongoose").Model<Appointment, any, any, any, Document<unknown, any, Appointment, any> & Appointment & {
    _id: Types.ObjectId;
} & {
    __v: number;
}, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, Appointment, Document<unknown, {}, import("mongoose").FlatRecord<Appointment>, {}> & import("mongoose").FlatRecord<Appointment> & {
    _id: Types.ObjectId;
} & {
    __v: number;
}>;

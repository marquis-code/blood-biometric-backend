// import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
// import { Document, Types } from 'mongoose';

// export type TransactionDocument = Transaction & Document;

// @Schema({ timestamps: true })
// export class Transaction {
//   @Prop({ type: Types.ObjectId, ref: 'User', required: true })
//   patientId: Types.ObjectId;

//   @Prop({ type: Types.ObjectId, ref: 'DoctorProfile', required: true })
//   doctorId: Types.ObjectId;

//   @Prop({ type: Types.ObjectId, ref: 'Appointment', required: true })
//   appointmentId: Types.ObjectId;

//   @Prop({ required: true })
//   amount: number;

//   @Prop({ required: true, default: 'USD' })
//   currency: string;

//   @Prop({ required: true })
//   stripePaymentIntentId: string;

//   @Prop({ enum: ['pending', 'succeeded', 'failed', 'cancelled', 'refunded'], default: 'pending' })
//   status: string;

//   @Prop({ default: 0 })
//   platformFee: number; // Commission taken by platform

//   @Prop({ default: 0 })
//   doctorEarnings: number; // Amount to be paid to doctor

//   @Prop({ default: false })
//   doctorPaid: boolean;

//   @Prop()
//   doctorPayoutId: string;

//   @Prop()
//   refundId: string;

//   @Prop()
//   refundAmount: number;

//   @Prop()
//   failureReason: string;

//   @Prop()
//   metadata: Record<string, any>;
// }

// export const TransactionSchema = SchemaFactory.createForClass(Transaction);

// // Indexes for optimization
// TransactionSchema.index({ patientId: 1 });
// TransactionSchema.index({ doctorId: 1 });
// TransactionSchema.index({ appointmentId: 1 });
// TransactionSchema.index({ status: 1 });
// TransactionSchema.index({ stripePaymentIntentId: 1 });

import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

// If you know the structure of your metadata, define it explicitly
export interface TransactionMetadata {
  consultationType?: string;
  paymentMethod?: string;
  customerIP?: string;
  userAgent?: string;
  sessionId?: string;
  // Add other fields as needed
  [key: string]: any; // Allow additional dynamic fields
}

export type TransactionDocument = Transaction & Document;

@Schema({ timestamps: true })
export class Transaction {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  patientId: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'DoctorProfile', required: true })
  doctorId: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'Appointment', required: true })
  appointmentId: Types.ObjectId;

  @Prop({ required: true })
  amount: number;

  @Prop({ required: true, default: 'USD' })
  currency: string;

  @Prop({ required: true })
  stripePaymentIntentId: string;

  @Prop({ enum: ['pending', 'succeeded', 'failed', 'cancelled', 'refunded'], default: 'pending' })
  status: string;

  @Prop({ default: 0 })
  platformFee: number; // Commission taken by platform

  @Prop({ default: 0 })
  doctorEarnings: number; // Amount to be paid to doctor

  @Prop({ default: false })
  doctorPaid: boolean;

  @Prop()
  doctorPayoutId: string;

  @Prop()
  refundId: string;

  @Prop()
  refundAmount: number;

  @Prop()
  failureReason: string;

  // ✅ Alternative: Define structured metadata with specific fields
  @Prop({
    type: {
      consultationType: { type: String },
      paymentMethod: { type: String },
      customerIP: { type: String },
      userAgent: { type: String },
      sessionId: { type: String }
    }
  })
  metadata: TransactionMetadata;
}

export const TransactionSchema = SchemaFactory.createForClass(Transaction);

// Indexes for optimization
TransactionSchema.index({ patientId: 1 });
TransactionSchema.index({ doctorId: 1 });
TransactionSchema.index({ appointmentId: 1 });
TransactionSchema.index({ status: 1 });
TransactionSchema.index({ stripePaymentIntentId: 1 });
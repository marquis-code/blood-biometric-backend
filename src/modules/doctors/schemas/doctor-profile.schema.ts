import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

// ✅ Create a separate schema for BankDetails
@Schema({ _id: false }) // _id: false prevents creating separate _id for nested documents
export class BankDetails {
  @Prop()
  accountName: string;

  @Prop()
  accountNumber: string;

  @Prop()
  bankName: string;

  @Prop()
  routingNumber: string;
}

const BankDetailsSchema = SchemaFactory.createForClass(BankDetails);

// ✅ Create schema for consultation fees by type
@Schema({ _id: false })
export class ConsultationFee {
  @Prop({ required: true, enum: ['video', 'audio', 'chat', 'in-person'] })
  type: string;

  @Prop({ required: true })
  amount: number;

  @Prop({ default: 'NGN', enum: ['NGN', 'USD', 'EUR', 'GBP'] })
  currency: string;

  @Prop({ default: true })
  isActive: boolean;
}

const ConsultationFeeSchema = SchemaFactory.createForClass(ConsultationFee);

export type DoctorProfileDocument = DoctorProfile & Document & { _id: Types.ObjectId };

@Schema({ timestamps: true })
export class DoctorProfile {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  userId: Types.ObjectId;

  @Prop({ required: true })
  licenseNumber: string;

  @Prop()
  licenseDocument: string; // URL to uploaded document

  @Prop([String])
  specialties: string[];

  @Prop()
  qualifications: string;

  @Prop()
  experience: number; // years of experience

  @Prop()
  bio: string;

  @Prop({ default: true })
  isAvailable: boolean;

  @Prop([String])
  languages: string[];

  // ✅ Replace single consultationFee with array of fees by type
  @Prop({
    type: [ConsultationFeeSchema],
    default: [
      { type: 'video', amount: 0, currency: 'NGN', isActive: true },
      { type: 'audio', amount: 0, currency: 'NGN', isActive: true },
      { type: 'chat', amount: 0, currency: 'NGN', isActive: true },
      { type: 'in-person', amount: 0, currency: 'NGN', isActive: false }
    ]
  })
  consultationFees: ConsultationFee[];

  @Prop()
  about: string;

  // Availability schedule
  @Prop({
    type: [{
      day: { type: String, enum: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'] },
      startTime: String,
      endTime: String,
      isAvailable: { type: Boolean, default: true }
    }]
  })
  weeklySchedule: {
    day: string;
    startTime: string;
    endTime: string;
    isAvailable: boolean;
  }[];

  // Stripe Connect ID for payouts
  @Prop()
  stripeConnectId: string;

  @Prop({
    type: [{
      day: { type: String, enum: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'] },
      slots: [{ startTime: String, endTime: String, isAvailable: { type: Boolean, default: true } }]
    }],
    default: []
  })
  availability: Array<{
    day: string;
    slots: Array<{
      startTime: string;
      endTime: string;
      isAvailable: boolean;
    }>;
  }>;

  @Prop([Date])
  blackoutDates: Date[];

  @Prop({ enum: ['pending', 'approved', 'rejected'], default: 'pending' })
  verificationStatus: string;

  @Prop()
  verifiedAt: Date;

  @Prop({ type: Types.ObjectId, ref: 'User' })
  verifiedBy: Types.ObjectId;

  @Prop()
  rejectionReason: string;

  @Prop({ default: 0 })
  averageRating: number;

  @Prop({ default: 0 })
  totalReviews: number;

  @Prop({ default: 0 })
  totalConsultations: number;

  @Prop({ default: true })
  isActive: boolean;

  // ✅ Use the BankDetails schema
  @Prop({ type: BankDetailsSchema })
  bankDetails: BankDetails;
}

export const DoctorProfileSchema = SchemaFactory.createForClass(DoctorProfile);

// Indexes for search optimization
DoctorProfileSchema.index({ userId: 1 });
DoctorProfileSchema.index({ specialties: 1 });
DoctorProfileSchema.index({ verificationStatus: 1 });
DoctorProfileSchema.index({ isActive: 1 });
DoctorProfileSchema.index({ averageRating: -1 });
DoctorProfileSchema.index({ 'consultationFees.type': 1 });
DoctorProfileSchema.index({ 'consultationFees.currency': 1 });
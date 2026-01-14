import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type DonorDocument = Donor & Document;

@Schema({ timestamps: true })
export class Donor {
  @Prop({ required: true })
  firstName: string;

  @Prop({ required: true })
  lastName: string;

  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ required: true, unique: true })
  phone: string;

  @Prop({ required: true })
  dateOfBirth: string;

  @Prop({ required: true })
  bloodType: string;

  @Prop({ required: true })
  gender: string;

  @Prop({ required: true })
  address: string;

  @Prop({ required: true, unique: true })
  credentialId: string;

  @Prop({ required: true })
  publicKey: string;

  @Prop()
  medicalNotes?: string;

  @Prop({ default: null })
  lastDonationDate: string;

  @Prop({ type: [String], default: [] })
  donationHistory: string[]; // Array of donation IDs

  @Prop({ default: Date.now })
  registrationDate: Date;
}

export const DonorSchema = SchemaFactory.createForClass(Donor);
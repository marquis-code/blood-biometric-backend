import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

@Schema({ timestamps: true })
export class Donation {
  @Prop({ type: Types.ObjectId, ref: 'Donor', required: true })
  donorId: Types.ObjectId;

  @Prop({ required: true })
  donationDate: Date;

  @Prop({ required: true })
  bloodType: string;

  @Prop({ required: true })
  quantity: string;

  @Prop({ required: true })
  location: string;

  @Prop({ type: Types.ObjectId, ref: 'Staff', required: true })
  staffId: Types.ObjectId;

  @Prop()
  notes?: string;
}

export const DonationSchema = SchemaFactory.createForClass(Donation);
export type DonationDocument = HydratedDocument<Donation>;
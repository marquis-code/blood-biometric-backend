import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type ReviewDocument = Review & Document;

@Schema({ timestamps: true })
export class Review {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  patientId: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'DoctorProfile', required: true })
  doctorId: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'Appointment', required: true })
  appointmentId: Types.ObjectId;

  @Prop({ required: true, min: 1, max: 5 })
  rating: number;

  @Prop()
  comment: string;

  @Prop({ default: true })
  isVisible: boolean;

  @Prop()
  doctorResponse: string;

  @Prop()
  doctorResponseDate: Date;
}

export const ReviewSchema = SchemaFactory.createForClass(Review);

// Indexes for optimization
ReviewSchema.index({ doctorId: 1 });
ReviewSchema.index({ patientId: 1 });
ReviewSchema.index({ appointmentId: 1 });
ReviewSchema.index({ rating: 1 });
ReviewSchema.index({ isVisible: 1 });
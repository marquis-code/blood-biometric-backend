import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type AppointmentDocument = Appointment & Document;

@Schema({ timestamps: true })
export class Appointment {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  patientId: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'DoctorProfile', required: true })
  doctorId: Types.ObjectId;

  @Prop({ required: true })
  appointmentDate: Date;

  @Prop({ required: true })
  startTime: string;

  @Prop({ required: true })
  endTime: string;

  @Prop({ enum: ['scheduled', 'confirmed', 'in-progress', 'completed', 'cancelled', 'no-show'], default: 'scheduled' })
  status: string;

    @Prop({ default: false })
  isPaid: boolean;

  @Prop()
  paymentId: string;

  @Prop()
  paidAt: Date;

  @Prop()
  amount: number;

  @Prop()
  notes: string;

  @Prop()
  cancelReason: string;

  @Prop()
  cancelledAt: Date;

  @Prop({ type: Types.ObjectId, ref: 'User' })
  cancelledBy: Types.ObjectId;


  @Prop({ enum: ['video', 'voice', 'chat'], required: true })
  consultationType: string;

  @Prop()
  reason: string;

  // @Prop()
  // notes: string; // Doctor's notes after consultation

  @Prop()
  prescription: string;

  @Prop({ required: true })
  consultationFee: number;

  // @Prop({ default: false })
  // isPaid: boolean;

  // @Prop()
  // paymentId: string;

  @Prop()
  meetingLink: string; // For video/voice calls

  @Prop()
  chatRoomId: string; // For chat consultations

  // @Prop()
  // cancelledBy: string; // 'patient' or 'doctor'

  // @Prop()
  // cancelledAt: Date;

  @Prop()
  cancellationReason: string;

  @Prop({ default: false })
  refundIssued: boolean;

  @Prop()
  refundAmount: number;
}

export const AppointmentSchema = SchemaFactory.createForClass(Appointment);

// Indexes for optimization
AppointmentSchema.index({ patientId: 1 });
AppointmentSchema.index({ doctorId: 1 });
AppointmentSchema.index({ appointmentDate: 1 });
AppointmentSchema.index({ status: 1 });
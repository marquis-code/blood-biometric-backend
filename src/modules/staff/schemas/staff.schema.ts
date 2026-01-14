import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

@Schema({ timestamps: true })
export class Staff {
  @Prop({ required: true })
  name: string; // Changed from firstName/lastName to just name

  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ required: true })
  password: string;

  @Prop({ required: true })
  role: string; // 'nurse', 'doctor', 'admin'
}

export const StaffSchema = SchemaFactory.createForClass(Staff);
export type StaffDocument = HydratedDocument<Staff>;
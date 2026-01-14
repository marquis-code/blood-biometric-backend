import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema({ timestamps: true })
export class Staff {
  @Prop({ required: true })
  firstName: string;

  @Prop({ required: true })
  lastName: string;

  @Prop({ required: true, unique: true })
  email: string;

  @Prop()
  phone?: string;

  @Prop()
  role?: string;

  @Prop()
  department?: string;

  @Prop({ type: Boolean, default: true })
  isActive: boolean;

  @Prop()
  password?: string;
}

export const StaffSchema = SchemaFactory.createForClass(Staff);
export type StaffDocument = any;
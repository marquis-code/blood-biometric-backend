import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

export interface Address {
  street: string;
  city: string;
  state: string;
  country: string;
  zipCode: string;
}

@Schema({ timestamps: true })
export class User {
  @Prop({ required: true })
  firstName: string;

  @Prop({ required: true })
  lastName: string;

  @Prop({ required: true, unique: true })
  email: string;

  @Prop()
  password: string;

  @Prop()
  phone: string;

  @Prop()
  dateOfBirth: Date;

  @Prop()
  gender: string;

  @Prop({ type: String, enum: ['patient', 'doctor', 'admin'], default: 'patient' })
  role: string;

  @Prop()
  profileImage: string;

  @Prop({ type: Object })
  address: Address;

  @Prop([String])
  medicalHistory: string[];

  @Prop()
  googleId: string;

  @Prop({ default: true })
  isActive: boolean;

  @Prop({ default: false })
  isVerified: boolean;

  @Prop()
  verificationToken: string;

  @Prop()
  resetPasswordToken: string;

  @Prop()
  resetPasswordExpires: Date;
}

export const UserSchema = SchemaFactory.createForClass(User);
export type UserDocument = any; // Nuclear option - just use 'any'

UserSchema.index({ email: 1 });
UserSchema.index({ role: 1 });
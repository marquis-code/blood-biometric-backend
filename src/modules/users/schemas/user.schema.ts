// import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
// import { Document } from 'mongoose';

// export type UserDocument = User & Document;

// @Schema({ timestamps: true })
// export class User {
//   @Prop({ required: true })
//   firstName: string;

//   @Prop({ required: true })
//   lastName: string;

//   @Prop({ required: true, unique: true })
//   email: string;

//   @Prop()
//   password: string;

//   @Prop()
//   phone: string;

//   @Prop()
//   dateOfBirth: Date;

//   @Prop()
//   gender: string;

//   @Prop({ enum: ['patient', 'doctor', 'admin'], default: 'patient' })
//   role: string;

//   @Prop()
//   profileImage: string;

//   @Prop()
//   address: {
//     street: string;
//     city: string;
//     state: string;
//     country: string;
//     zipCode: string;
//   };

//   @Prop([String])
//   medicalHistory: string[];

//   @Prop()
//   googleId: string;

//   @Prop({ default: true })
//   isActive: boolean;

//   @Prop({ default: false })
//   isVerified: boolean;

//   @Prop()
//   verificationToken: string;

//   @Prop()
//   resetPasswordToken: string;

//   @Prop()
//   resetPasswordExpires: Date;
// }

// export const UserSchema = SchemaFactory.createForClass(User);

// // Index for search optimization
// UserSchema.index({ email: 1 });
// UserSchema.index({ role: 1 });

// import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
// import { Document, Types } from 'mongoose';

// // Tell TS what a real Mongoose document looks like
// export type UserDocument = User & Document;

// @Schema({ timestamps: true })
// export class User extends Document {
//   // ✅ Explicitly declare the _id field
//   readonly _id: Types.ObjectId;

//   @Prop({ required: true })
//   firstName: string;

//   @Prop({ required: true })
//   lastName: string;

//   @Prop({ required: true, unique: true })
//   email: string;

//   @Prop()
//   password: string;

//   @Prop()
//   phone: string;

//   @Prop()
//   dateOfBirth: Date;

//   @Prop()
//   gender: string;

//   @Prop({ enum: ['patient', 'doctor', 'admin'], default: 'patient' })
//   role: string;

//   @Prop()
//   profileImage: string;

//   @Prop()
//   address: {
//     street: string;
//     city: string;
//     state: string;
//     country: string;
//     zipCode: string;
//   };

//   @Prop([String])
//   medicalHistory: string[];

//   @Prop()
//   googleId: string;

//   @Prop({ default: true })
//   isActive: boolean;

//   @Prop({ default: false })
//   isVerified: boolean;

//   @Prop()
//   verificationToken: string;

//   @Prop()
//   resetPasswordToken: string;

//   @Prop()
//   resetPasswordExpires: Date;
// }

// export const UserSchema = SchemaFactory.createForClass(User);

// // Optional indexes
// UserSchema.index({ email: 1 });
// UserSchema.index({ role: 1 });


import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

// Define the Address interface/type
export interface Address {
  street: string;
  city: string;
  state: string;
  country: string;
  zipCode: string;
}

// Tell TS what a real Mongoose document looks like
export type UserDocument = User & Document;

@Schema({ timestamps: true })
export class User extends Document {
  // ✅ Explicitly declare the _id field
  readonly _id: Types.ObjectId;

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

  @Prop({ enum: ['patient', 'doctor', 'admin'], default: 'patient' })
  role: string;

  @Prop()
  profileImage: string;

  // ✅ Fix: Use explicit type definition for nested object
  @Prop({
    type: {
      street: { type: String },
      city: { type: String },
      state: { type: String },
      country: { type: String },
      zipCode: { type: String }
    }
  })
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

// Optional indexes
UserSchema.index({ email: 1 });
UserSchema.index({ role: 1 });
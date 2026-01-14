import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AdminService } from './admin.service';
import { AdminController } from './admin.controller';
import { User, UserSchema } from '../users/schemas/user.schema';
import { DoctorProfile, DoctorProfileSchema } from '../doctors/schemas/doctor-profile.schema';
import { Appointment, AppointmentSchema } from '../appointments/schemas/appointment.schema';
import { Transaction, TransactionSchema } from '../payments/schemas/transaction.schema';
import { Review, ReviewSchema } from '../reviews/schemas/review.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      { name: DoctorProfile.name, schema: DoctorProfileSchema },
      { name: Appointment.name, schema: AppointmentSchema },
      { name: Transaction.name, schema: TransactionSchema },
      { name: Review.name, schema: ReviewSchema },
    ]),
  ],
  controllers: [AdminController],
  providers: [AdminService],
  exports: [AdminService],
})
export class AdminModule {}
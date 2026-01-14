import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { DoctorsService } from './doctors.service';
import { DoctorsController } from './doctors.controller';
import { DoctorProfile, DoctorProfileSchema } from './schemas/doctor-profile.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: DoctorProfile.name, schema: DoctorProfileSchema }]),
  ],
  controllers: [DoctorsController],
  providers: [DoctorsService],
  exports: [DoctorsService],
})
export class DoctorsModule {}
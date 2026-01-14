import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { BiometricController } from './biometric.controller';
import { BiometricService } from './biometric.service';
import { Donor, DonorSchema } from '../donors/schemas/donor.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Donor.name, schema: DonorSchema }]),
  ],
  controllers: [BiometricController],
  providers: [BiometricService],
  exports: [BiometricService],
})
export class BiometricModule {}

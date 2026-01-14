// import { Module } from '@nestjs/common';
// import { MongooseModule } from '@nestjs/mongoose';
// import { PaymentsService } from './payments.service';
// import { PaymentsController } from './payments.controller';
// import { Transaction, TransactionSchema } from './schemas/transaction.schema';

// @Module({
//   imports: [
//     MongooseModule.forFeature([{ name: Transaction.name, schema: TransactionSchema }]),
//   ],
//   controllers: [PaymentsController],
//   providers: [PaymentsService],
//   exports: [PaymentsService],
// })
// export class PaymentsModule {}

import { Module, forwardRef } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { PaymentsService } from './payments.service';
import { PaymentsController } from './payments.controller';
import { Transaction, TransactionSchema } from './schemas/transaction.schema';
import { AppointmentsModule } from '../appointments/appointments.module';
import { DoctorsModule } from '../doctors/doctors.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Transaction.name, schema: TransactionSchema }
    ]),
    forwardRef(() => AppointmentsModule),
    forwardRef(() => DoctorsModule),
  ],
  controllers: [PaymentsController],
  providers: [PaymentsService],
  exports: [PaymentsService],
})
export class PaymentsModule {}
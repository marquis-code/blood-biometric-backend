// import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
// import { InjectModel } from '@nestjs/mongoose';
// import { Model } from 'mongoose';
// import { Transaction, TransactionDocument } from './schemas/transaction.schema';
// import { CreatePaymentDto } from './dto/create-payment.dto';
// import Stripe from 'stripe';
// import { AppointmentsService } from '../appointments/appointments.service';

// @Injectable()
// export class PaymentsService {
//   private stripe: Stripe;

//   constructor(
//     @InjectModel(Transaction.name) private transactionModel: Model<TransactionDocument>,
//   ) {
//     this.stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
//       apiVersion: '2023-10-16',
//     });
//   }

//   async createPaymentIntent(
//     patientId: string,
//     createPaymentDto: CreatePaymentDto,
//   ): Promise<{ clientSecret: string; transactionId: string }> {
//     // Get appointment details
//     const appointment = await this.getAppointmentDetails(createPaymentDto.appointmentId);

//     if (appointment.patientId.toString() !== patientId) {
//       throw new BadRequestException('Unauthorized to pay for this appointment');
//     }

//     if (appointment.isPaid) {
//       throw new BadRequestException('Appointment already paid');
//     }

//     // Calculate platform fee (10% default)
//     const platformFeePercent = 0.10;
//     const platformFee = Math.round(createPaymentDto.amount * platformFeePercent);
//     const doctorEarnings = createPaymentDto.amount - platformFee;

//     // Create Stripe payment intent
//     const paymentIntent = await this.stripe.paymentIntents.create({
//       amount: Math.round(createPaymentDto.amount * 100), // Convert to cents
//       currency: 'usd',
//       payment_method: createPaymentDto.paymentMethodId,
//       confirmation_method: 'manual',
//       confirm: true,
//       return_url: `${process.env.FRONTEND_URL}/payment/success`,
//       metadata: {
//         appointmentId: createPaymentDto.appointmentId,
//         patientId,
//         doctorId: appointment.doctorId.toString(),
//       },
//     });

//     // Create transaction record
//     const transaction = new this.transactionModel({
//       patientId,
//       doctorId: appointment.doctorId,
//       appointmentId: createPaymentDto.appointmentId,
//       amount: createPaymentDto.amount,
//       platformFee,
//       doctorEarnings,
//       stripePaymentIntentId: paymentIntent.id,
//       status: paymentIntent.status === 'succeeded' ? 'succeeded' : 'pending',
//     });

//     const savedTransaction = await transaction.save();

//     // If payment succeeded immediately, update appointment
//     if (paymentIntent.status === 'succeeded') {
//       await this.confirmPayment(savedTransaction._id.toString());
//     }

//     return {
//       clientSecret: paymentIntent.client_secret,
//       transactionId: savedTransaction._id.toString(),
//     };
//   }

//   async confirmPayment(transactionId: string): Promise<void> {
//     const transaction = await this.transactionModel.findById(transactionId);

//     if (!transaction) {
//       throw new NotFoundException('Transaction not found');
//     }

//     // Update transaction status
//     await this.transactionModel.findByIdAndUpdate(transactionId, {
//       status: 'succeeded',
//     });

//     // Update appointment payment status
//     await this.updateAppointmentPayment(
//       transaction.appointmentId.toString(),
//       transaction.stripePaymentIntentId,
//     );
//   }

//   async handleWebhook(signature: string, payload: Buffer): Promise<void> {
//     let event: Stripe.Event;

//     try {
//       event = this.stripe.webhooks.constructEvent(
//         payload,
//         signature,
//         process.env.STRIPE_WEBHOOK_SECRET,
//       );
//     } catch (err) {
//       throw new BadRequestException(`Webhook signature verification failed: ${err.message}`);
//     }

//     switch (event.type) {
//       case 'payment_intent.succeeded':
//         await this.handlePaymentSucceeded(event.data.object as Stripe.PaymentIntent);
//         break;
//       case 'payment_intent.payment_failed':
//         await this.handlePaymentFailed(event.data.object as Stripe.PaymentIntent);
//         break;
//       default:
//         console.log(`Unhandled event type ${event.type}`);
//     }
//   }

//   private async handlePaymentSucceeded(paymentIntent: Stripe.PaymentIntent): Promise<void> {
//     const transaction = await this.transactionModel.findOne({
//       stripePaymentIntentId: paymentIntent.id,
//     });

//     if (transaction) {
//       await this.confirmPayment(transaction._id.toString());
//     }
//   }

//   private async handlePaymentFailed(paymentIntent: Stripe.PaymentIntent): Promise<void> {
//     await this.transactionModel.findOneAndUpdate(
//       { stripePaymentIntentId: paymentIntent.id },
//       {
//         status: 'failed',
//         failureReason: paymentIntent.last_payment_error?.message || 'Payment failed',
//       },
//     );
//   }

//   async processRefund(paymentIntentId: string, amount: number): Promise<void> {
//     try {
//       const refund = await this.stripe.refunds.create({
//         payment_intent: paymentIntentId,
//         amount: Math.round(amount * 100), // Convert to cents
//       });

//       await this.transactionModel.findOneAndUpdate(
//         { stripePaymentIntentId: paymentIntentId },
//         {
//           status: 'refunded',
//           refundId: refund.id,
//           refundAmount: amount,
//         },
//       );
//     } catch (error) {
//       throw new BadRequestException(`Refund failed: ${error.message}`);
//     }
//   }

//   async getDoctorEarnings(doctorId: string): Promise<{ total: number; pending: number; paid: number }> {
//     const earnings = await this.transactionModel.aggregate([
//       { $match: { doctorId, status: 'succeeded' } },
//       {
//         $group: {
//           _id: null,
//           total: { $sum: '$doctorEarnings' },
//           pending: {
//             $sum: {
//               $cond: [{ $eq: ['$doctorPaid', false] }, '$doctorEarnings', 0],
//             },
//           },
//           paid: {
//             $sum: {
//               $cond: [{ $eq: ['$doctorPaid', true] }, '$doctorEarnings', 0],
//             },
//           },
//         },
//       },
//     ]);

//     return earnings[0] || { total: 0, pending: 0, paid: 0 };
//   }

//   async processDoctorPayout(doctorId: string): Promise<void> {
//     const doctor = await this.getDoctorProfile(doctorId);

//     if (!doctor.stripeConnectId) {
//       throw new BadRequestException('Doctor has not connected their Stripe account');
//     }

//     const pendingTransactions = await this.transactionModel.find({
//       doctorId,
//       status: 'succeeded',
//       doctorPaid: false,
//     });

//     if (pendingTransactions.length === 0) {
//       throw new BadRequestException('No pending earnings to pay out');
//     }

//     const totalAmount = pendingTransactions.reduce(
//       (sum, transaction) => sum + transaction.doctorEarnings,
//       0,
//     );

//     try {
//       const transfer = await this.stripe.transfers.create({
//         amount: Math.round(totalAmount * 100), // Convert to cents
//         currency: 'usd',
//         destination: doctor.stripeConnectId,
//       });

//       // Update transactions as paid
//       await this.transactionModel.updateMany(
//         { _id: { $in: pendingTransactions.map(t => t._id) } },
//         {
//           doctorPaid: true,
//           doctorPayoutId: transfer.id,
//         },
//       );
//     } catch (error) {
//       throw new BadRequestException(`Payout failed: ${error.message}`);
//     }
//   }

//   async getTransactionHistory(userId: string, role: string): Promise<Transaction[]> {
//     const query: any = { status: 'succeeded' };

//     if (role === 'patient') {
//       query.patientId = userId;
//     } else if (role === 'doctor') {
//       const doctorProfile = await this.getDoctorProfile(userId);
//       if (doctorProfile) {
//         query.doctorId = doctorProfile._id;
//       }
//     }

//     return this.transactionModel
//       .find(query)
//       .populate('patientId', 'firstName lastName email')
//       .populate({
//         path: 'doctorId',
//         populate: { path: 'userId', select: 'firstName lastName email' },
//       })
//       .populate('appointmentId', 'appointmentDate startTime consultationType')
//       .sort({ createdAt: -1 })
//       .exec();
//   }

//   async getPlatformRevenue(): Promise<{ total: number; thisMonth: number; lastMonth: number }> {
//     const now = new Date();
//     const startOfThisMonth = new Date(now.getFullYear(), now.getMonth(), 1);
//     const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);

//     const revenue = await this.transactionModel.aggregate([
//       { $match: { status: 'succeeded' } },
//       {
//         $group: {
//           _id: null,
//           total: { $sum: '$platformFee' },
//           thisMonth: {
//             $sum: {
//               $cond: [
//                 { $gte: ['$createdAt', startOfThisMonth] },
//                 '$platformFee',
//                 0,
//               ],
//             },
//           },
//           lastMonth: {
//             $sum: {
//               $cond: [
//                 {
//                   $and: [
//                     { $gte: ['$createdAt', startOfLastMonth] },
//                     { $lt: ['$createdAt', startOfThisMonth] },
//                   ],
//                 },
//                 '$platformFee',
//                 0,
//               ],
//             },
//           },
//         },
//       },
//     ]);

//     return revenue[0] || { total: 0, thisMonth: 0, lastMonth: 0 };
//   }

//   // Helper methods (these would need to be implemented to interact with other services)
//   private async getAppointmentDetails(appointmentId: string): Promise<any> {
//     // This would typically call the AppointmentsService
//     // For now, we'll assume this method exists
//     throw new Error('Method not implemented - integrate with AppointmentsService');
//   }

//   private async updateAppointmentPayment(appointmentId: string, paymentId: string): Promise<void> {
//     // This would typically call the AppointmentsService
//     // For now, we'll assume this method exists
//     throw new Error('Method not implemented - integrate with AppointmentsService');
//   }

//   private async getDoctorProfile(userId: string): Promise<any> {
//     // This would typically call the DoctorsService
//     // For now, we'll assume this method exists
//     throw new Error('Method not implemented - integrate with DoctorsService');
//   }
// }

import { Injectable, BadRequestException, NotFoundException, Inject, forwardRef } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Transaction, TransactionDocument } from './schemas/transaction.schema';
import { CreatePaymentDto } from './dto/create-payment.dto';
import Stripe from 'stripe';
import { AppointmentsService } from '../appointments/appointments.service';
import { DoctorsService } from '../doctors/doctors.service';

@Injectable()
export class PaymentsService {
  private stripe: Stripe;

  constructor(
    @InjectModel(Transaction.name) private transactionModel: Model<TransactionDocument>,
    @Inject(forwardRef(() => AppointmentsService))
    private appointmentsService: AppointmentsService,
    @Inject(forwardRef(() => DoctorsService))
    private doctorsService: DoctorsService,
  ) {
    this.stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
      // @ts-ignore - Using specific API version for compatibility
      apiVersion: '2023-10-16',
    });
  }

  async createPaymentIntent(
    patientId: string,
    createPaymentDto: CreatePaymentDto,
  ): Promise<{ clientSecret: string; transactionId: string }> {
    // Get appointment details
    const appointment = await this.getAppointmentDetails(createPaymentDto.appointmentId);

    if (appointment.patientId.toString() !== patientId) {
      throw new BadRequestException('Unauthorized to pay for this appointment');
    }

    if (appointment.isPaid) {
      throw new BadRequestException('Appointment already paid');
    }

    // Calculate platform fee (10% default)
    const platformFeePercent = 0.10;
    const platformFee = Math.round(createPaymentDto.amount * platformFeePercent);
    const doctorEarnings = createPaymentDto.amount - platformFee;

    // Create Stripe payment intent
    const paymentIntent = await this.stripe.paymentIntents.create({
      amount: Math.round(createPaymentDto.amount * 100), // Convert to cents
      currency: 'usd',
      payment_method: createPaymentDto.paymentMethodId,
      confirmation_method: 'manual',
      confirm: true,
      return_url: `${process.env.FRONTEND_URL}/payment/success`,
      metadata: {
        appointmentId: createPaymentDto.appointmentId,
        patientId,
        doctorId: appointment.doctorId.toString(),
      },
    });

    // Create transaction record
    const transaction = new this.transactionModel({
      patientId,
      doctorId: appointment.doctorId,
      appointmentId: createPaymentDto.appointmentId,
      amount: createPaymentDto.amount,
      platformFee,
      doctorEarnings,
      stripePaymentIntentId: paymentIntent.id,
      status: paymentIntent.status === 'succeeded' ? 'succeeded' : 'pending',
    });

    const savedTransaction = await transaction.save();

    // If payment succeeded immediately, update appointment
    if (paymentIntent.status === 'succeeded') {
      await this.confirmPayment(savedTransaction._id.toString());
    }

    return {
      clientSecret: paymentIntent.client_secret,
      transactionId: savedTransaction._id.toString(),
    };
  }

  async confirmPayment(transactionId: string): Promise<void> {
    const transaction = await this.transactionModel.findById(transactionId);

    if (!transaction) {
      throw new NotFoundException('Transaction not found');
    }

    // Update transaction status
    await this.transactionModel.findByIdAndUpdate(transactionId, {
      status: 'succeeded',
    });

    // Update appointment payment status
    await this.updateAppointmentPayment(
      transaction.appointmentId.toString(),
      transaction.stripePaymentIntentId,
    );
  }

  async handleWebhook(signature: string, payload: Buffer): Promise<void> {
    let event: Stripe.Event;

    try {
      event = this.stripe.webhooks.constructEvent(
        payload,
        signature,
        process.env.STRIPE_WEBHOOK_SECRET,
      );
    } catch (err) {
      throw new BadRequestException(`Webhook signature verification failed: ${err.message}`);
    }

    switch (event.type) {
      case 'payment_intent.succeeded':
        await this.handlePaymentSucceeded(event.data.object as Stripe.PaymentIntent);
        break;
      case 'payment_intent.payment_failed':
        await this.handlePaymentFailed(event.data.object as Stripe.PaymentIntent);
        break;
      default:
        console.log(`Unhandled event type ${event.type}`);
    }
  }

  private async handlePaymentSucceeded(paymentIntent: Stripe.PaymentIntent): Promise<void> {
    const transaction = await this.transactionModel.findOne({
      stripePaymentIntentId: paymentIntent.id,
    });

    if (transaction) {
      await this.confirmPayment(transaction._id.toString());
    }
  }

  private async handlePaymentFailed(paymentIntent: Stripe.PaymentIntent): Promise<void> {
    await this.transactionModel.findOneAndUpdate(
      { stripePaymentIntentId: paymentIntent.id },
      {
        status: 'failed',
        failureReason: paymentIntent.last_payment_error?.message || 'Payment failed',
      },
    );
  }

  async processRefund(paymentIntentId: string, amount: number): Promise<void> {
    try {
      const refund = await this.stripe.refunds.create({
        payment_intent: paymentIntentId,
        amount: Math.round(amount * 100), // Convert to cents
      });

      await this.transactionModel.findOneAndUpdate(
        { stripePaymentIntentId: paymentIntentId },
        {
          status: 'refunded',
          refundId: refund.id,
          refundAmount: amount,
        },
      );
    } catch (error) {
      throw new BadRequestException(`Refund failed: ${error.message}`);
    }
  }

  async getDoctorEarnings(doctorId: string): Promise<{ total: number; pending: number; paid: number }> {
    // First get the doctor profile to get the actual doctor profile ID
    const doctorProfile = await this.getDoctorProfile(doctorId);
    if (!doctorProfile) {
      throw new NotFoundException('Doctor profile not found');
    }

    const earnings = await this.transactionModel.aggregate([
      { $match: { doctorId: doctorProfile._id, status: 'succeeded' } },
      {
        $group: {
          _id: null,
          total: { $sum: '$doctorEarnings' },
          pending: {
            $sum: {
              $cond: [{ $eq: ['$doctorPaid', false] }, '$doctorEarnings', 0],
            },
          },
          paid: {
            $sum: {
              $cond: [{ $eq: ['$doctorPaid', true] }, '$doctorEarnings', 0],
            },
          },
        },
      },
    ]);

    return earnings[0] || { total: 0, pending: 0, paid: 0 };
  }

  async processDoctorPayout(doctorId: string): Promise<void> {
    const doctor = await this.getDoctorProfile(doctorId);

    if (!doctor) {
      throw new NotFoundException('Doctor profile not found');
    }

    if (!doctor.stripeConnectId) {
      throw new BadRequestException('Doctor has not connected their Stripe account');
    }

    const pendingTransactions = await this.transactionModel.find({
      doctorId: doctor._id,
      status: 'succeeded',
      doctorPaid: false,
    });

    if (pendingTransactions.length === 0) {
      throw new BadRequestException('No pending earnings to pay out');
    }

    const totalAmount = pendingTransactions.reduce(
      (sum, transaction) => sum + transaction.doctorEarnings,
      0,
    );

    try {
      const transfer = await this.stripe.transfers.create({
        amount: Math.round(totalAmount * 100), // Convert to cents
        currency: 'usd',
        destination: doctor.stripeConnectId,
      });

      // Update transactions as paid
      await this.transactionModel.updateMany(
        { _id: { $in: pendingTransactions.map(t => t._id) } },
        {
          doctorPaid: true,
          doctorPayoutId: transfer.id,
        },
      );
    } catch (error) {
      throw new BadRequestException(`Payout failed: ${error.message}`);
    }
  }

  async getTransactionHistory(userId: string, role: string): Promise<Transaction[]> {
    const query: any = { status: 'succeeded' };

    if (role === 'patient') {
      query.patientId = userId;
    } else if (role === 'doctor') {
      const doctorProfile = await this.getDoctorProfile(userId);
      if (doctorProfile) {
        query.doctorId = doctorProfile._id;
      } else {
        // Return empty array if no doctor profile found
        return [];
      }
    }

    return this.transactionModel
      .find(query)
      .populate('patientId', 'firstName lastName email')
      .populate({
        path: 'doctorId',
        populate: { path: 'userId', select: 'firstName lastName email' },
      })
      .populate('appointmentId', 'appointmentDate startTime consultationType')
      .sort({ createdAt: -1 })
      .exec();
  }

  async getPlatformRevenue(): Promise<{ total: number; thisMonth: number; lastMonth: number }> {
    const now = new Date();
    const startOfThisMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);

    const revenue = await this.transactionModel.aggregate([
      { $match: { status: 'succeeded' } },
      {
        $group: {
          _id: null,
          total: { $sum: '$platformFee' },
          thisMonth: {
            $sum: {
              $cond: [
                { $gte: ['$createdAt', startOfThisMonth] },
                '$platformFee',
                0,
              ],
            },
          },
          lastMonth: {
            $sum: {
              $cond: [
                {
                  $and: [
                    { $gte: ['$createdAt', startOfLastMonth] },
                    { $lt: ['$createdAt', startOfThisMonth] },
                  ],
                },
                '$platformFee',
                0,
              ],
            },
          },
        },
      },
    ]);

    return revenue[0] || { total: 0, thisMonth: 0, lastMonth: 0 };
  }

  // Helper methods - now properly implemented
  private async getAppointmentDetails(appointmentId: string): Promise<any> {
    try {
      const appointment = await this.appointmentsService.findById(appointmentId);
      if (!appointment) {
        throw new NotFoundException('Appointment not found');
      }
      return appointment;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new BadRequestException('Failed to fetch appointment details');
    }
  }

  private async updateAppointmentPayment(appointmentId: string, paymentId: string): Promise<void> {
    try {
      await this.appointmentsService.updatePaymentStatus(appointmentId, {
        isPaid: true,
        paymentId,
        paidAt: new Date(),
      });
    } catch (error) {
      console.error('Failed to update appointment payment status:', error);
      // Log error but don't throw to prevent payment confirmation from failing
    }
  }

  private async getDoctorProfile(userId: string): Promise<any> {
    try {
      const doctorProfile = await this.doctorsService.findByUserId(userId);
      return doctorProfile;
    } catch (error) {
      console.error('Failed to fetch doctor profile:', error);
      return null;
    }
  }

  // Additional utility methods
  async getTransactionById(transactionId: string): Promise<Transaction> {
    const transaction = await this.transactionModel
      .findById(transactionId)
      .populate('patientId', 'firstName lastName email')
      .populate({
        path: 'doctorId',
        populate: { path: 'userId', select: 'firstName lastName email' },
      })
      .populate('appointmentId', 'appointmentDate startTime consultationType')
      .exec();

    if (!transaction) {
      throw new NotFoundException('Transaction not found');
    }

    return transaction;
  }

  async cancelPayment(transactionId: string): Promise<void> {
    const transaction = await this.transactionModel.findById(transactionId);

    if (!transaction) {
      throw new NotFoundException('Transaction not found');
    }

    if (transaction.status !== 'pending') {
      throw new BadRequestException('Cannot cancel non-pending transaction');
    }

    try {
      // Cancel the Stripe payment intent
      await this.stripe.paymentIntents.cancel(transaction.stripePaymentIntentId);

      // Update transaction status
      await this.transactionModel.findByIdAndUpdate(transactionId, {
        status: 'cancelled',
      });
    } catch (error) {
      throw new BadRequestException(`Failed to cancel payment: ${error.message}`);
    }
  }
}
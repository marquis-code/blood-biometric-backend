// import { Injectable, NotFoundException, BadRequestException, ConflictException } from '@nestjs/common';
// import { InjectModel } from '@nestjs/mongoose';
// import { Model } from 'mongoose';
// import { Appointment, AppointmentDocument } from './schemas/appointment.schema';
// import { CreateAppointmentDto } from './dto/create-appointment.dto';
// import { UpdateAppointmentDto } from './dto/update-appointment.dto';
// import { PaymentsService } from '../payments/payments.service';
// import { DoctorsService } from '../doctors/doctors.service';
// import { NotificationsService } from '../notifications/notifications.service';

// @Injectable()
// export class AppointmentsService {
//   constructor(
//     @InjectModel(Appointment.name) 
//     private appointmentModel: Model<AppointmentDocument>,
//     private paymentsService: PaymentsService,
//     private doctorsService: DoctorsService,
//     private notificationsService: NotificationsService,
//   ) {}

//   async create(patientId: string, createAppointmentDto: CreateAppointmentDto): Promise<Appointment> {
//     // Check if the time slot is available
//     const existingAppointment = await this.appointmentModel.findOne({
//       doctorId: createAppointmentDto.doctorId,
//       appointmentDate: createAppointmentDto.appointmentDate,
//       startTime: createAppointmentDto.startTime,
//       status: { $nin: ['cancelled', 'no-show'] },
//     });

//     if (existingAppointment) {
//       throw new ConflictException('Time slot is not available');
//     }

//     // Verify doctor exists and is available
//     const doctor = await this.doctorsService.findOne(createAppointmentDto.doctorId);
//     if (!doctor || doctor.verificationStatus !== 'approved') {
//       throw new BadRequestException('Doctor not available');
//     }

//     const appointment = new this.appointmentModel({
//       patientId,
//       ...createAppointmentDto,
//     });

//     const savedAppointment = await appointment.save();

//     // Populate the appointment for return
//     await savedAppointment.populate([
//       { path: 'patientId', select: 'firstName lastName email phone' },
//       { path: 'doctorId', populate: { path: 'userId', select: 'firstName lastName email' } }
//     ]);

//     // Send confirmation notifications
//     await this.notificationsService.sendAppointmentConfirmation(savedAppointment);

//     return savedAppointment;
//   }

//   async findAll(): Promise<Appointment[]> {
//     return this.appointmentModel
//       .find()
//       .populate('patientId', 'firstName lastName email')
//       .populate({
//         path: 'doctorId',
//         populate: { path: 'userId', select: 'firstName lastName email' }
//       })
//       .sort({ appointmentDate: 1, startTime: 1 })
//       .exec();
//   }

//   async findByPatient(patientId: string): Promise<Appointment[]> {
//     return this.appointmentModel
//       .find({ patientId })
//       .populate({
//         path: 'doctorId',
//         populate: { path: 'userId', select: 'firstName lastName email' }
//       })
//       .sort({ appointmentDate: -1 })
//       .exec();
//   }

//   async findByDoctor(doctorId: string): Promise<Appointment[]> {
//     return this.appointmentModel
//       .find({ doctorId })
//       .populate('patientId', 'firstName lastName email phone')
//       .sort({ appointmentDate: 1, startTime: 1 })
//       .exec();
//   }

//   async findOne(id: string): Promise<Appointment> {
//     const appointment = await this.appointmentModel
//       .findById(id)
//       .populate('patientId', 'firstName lastName email phone')
//       .populate({
//         path: 'doctorId',
//         populate: { path: 'userId', select: 'firstName lastName email' }
//       })
//       .exec();

//     if (!appointment) {
//       throw new NotFoundException('Appointment not found');
//     }

//     return appointment;
//   }

//   async update(id: string, updateAppointmentDto: UpdateAppointmentDto): Promise<Appointment> {
//     const appointment = await this.appointmentModel
//       .findByIdAndUpdate(id, updateAppointmentDto, { new: true })
//       .populate('patientId', 'firstName lastName email')
//       .populate({
//         path: 'doctorId',
//         populate: { path: 'userId', select: 'firstName lastName email' }
//       })
//       .exec();

//     if (!appointment) {
//       throw new NotFoundException('Appointment not found');
//     }

//     return appointment;
//   }

//   async cancel(id: string, cancelledBy: string, cancellationReason?: string): Promise<Appointment> {
//     const appointment = await this.findOne(id);
    
//     if (['cancelled', 'completed'].includes(appointment.status)) {
//       throw new BadRequestException('Appointment cannot be cancelled');
//     }

//     const now = new Date();
//     const appointmentDateTime = new Date(`${appointment.appointmentDate} ${appointment.startTime}`);
//     const hoursUntilAppointment = (appointmentDateTime.getTime() - now.getTime()) / (1000 * 60 * 60);

//     // Check if cancellation is allowed (e.g., at least 24 hours before)
//     if (hoursUntilAppointment < 24) {
//       throw new BadRequestException('Appointment can only be cancelled at least 24 hours in advance');
//     }

//     const updatedAppointment = await this.update(id, {
//       status: 'cancelled',
//       cancelledBy,
//       cancellationReason,
//     });

//     // Process refund if payment was made
//     if (appointment.isPaid && appointment.paymentId) {
//       await this.paymentsService.processRefund(appointment.paymentId, appointment.consultationFee);
//       await this.update(id, { refundIssued: true, refundAmount: appointment.consultationFee });
//     }

//     // Send cancellation notifications
//     await this.notificationsService.sendAppointmentCancellation(updatedAppointment);

//     return updatedAppointment;
//   }

//   async confirmPayment(id: string, paymentId: string): Promise<Appointment> {
//     return this.update(id, {
//       isPaid: true,
//       paymentId,
//       status: 'confirmed',
//     });
//   }

//   async completeAppointment(id: string, notes?: string, prescription?: string): Promise<Appointment> {
//     const appointment = await this.update(id, {
//       status: 'completed',
//       notes,
//       prescription,
//     });

//     // Increment doctor's consultation count
//     await this.doctorsService.incrementConsultations(appointment.doctorId.toString());

//     // Send completion notification
//     await this.notificationsService.sendAppointmentCompletion(appointment);

//     return appointment;
//   }

//   async getUpcomingAppointments(userId: string, role: string): Promise<Appointment[]> {
//     const now = new Date();
//     const query: any = {
//       appointmentDate: { $gte: now },
//       status: { $in: ['scheduled', 'confirmed'] }
//     };

//     if (role === 'patient') {
//       query.patientId = userId;
//     } else if (role === 'doctor') {
//       const doctorProfile = await this.doctorsService.findByUserId(userId);
//       if (doctorProfile) {
//         query.doctorId = doctorProfile._id;
//       }
//     }

//     return this.appointmentModel
//       .find(query)
//       .populate('patientId', 'firstName lastName email')
//       .populate({
//         path: 'doctorId',
//         populate: { path: 'userId', select: 'firstName lastName email' }
//       })
//       .sort({ appointmentDate: 1, startTime: 1 })
//       .limit(10)
//       .exec();
//   }

//   async generateMeetingLink(appointmentId: string): Promise<string> {
//     // In a real implementation, you would integrate with a video calling service like Twilio, Daily.co, etc.
//     // For now, we'll return a mock meeting link
//     const meetingLink = `https://meet.consultation-platform.com/room/${appointmentId}`;
    
//     await this.update(appointmentId, { meetingLink });
    
//     return meetingLink;
//   }
// }


import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ConflictException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Appointment, AppointmentDocument } from './schemas/appointment.schema';
import { CreateAppointmentDto } from './dto/create-appointment.dto';
import { UpdateAppointmentDto } from './dto/update-appointment.dto';
import { PaymentsService } from '../payments/payments.service';
import { DoctorsService } from '../doctors/doctors.service';
import { NotificationsService } from '../notifications/notifications.service';
import { DoctorProfileDocument } from '../doctors/schemas/doctor-profile.schema'; // ✅ make sure path matches your project

@Injectable()
export class AppointmentsService {
  constructor(
    @InjectModel(Appointment.name)
    private readonly appointmentModel: Model<AppointmentDocument>,
    private readonly paymentsService: PaymentsService,
    private readonly doctorsService: DoctorsService,
    private readonly notificationsService: NotificationsService,
  ) {}

  async create(
    patientId: string,
    createAppointmentDto: CreateAppointmentDto,
  ): Promise<Appointment> {
    // Ensure the doctor/time slot is available
    const existingAppointment = await this.appointmentModel.findOne({
      doctorId: createAppointmentDto.doctorId,
      appointmentDate: createAppointmentDto.appointmentDate,
      startTime: createAppointmentDto.startTime,
      status: { $nin: ['cancelled', 'no-show'] },
    });

    if (existingAppointment) {
      throw new ConflictException('Time slot is not available');
    }

    // Verify doctor exists and is approved
    const doctor = await this.doctorsService.findOne(
      createAppointmentDto.doctorId,
    );
    if (!doctor || doctor.verificationStatus !== 'approved') {
      throw new BadRequestException('Doctor not available');
    }

    const appointment = new this.appointmentModel({
      patientId,
      ...createAppointmentDto,
    });

    const savedAppointment = await appointment.save();

    await savedAppointment.populate([
      { path: 'patientId', select: 'firstName lastName email phone' },
      {
        path: 'doctorId',
        populate: { path: 'userId', select: 'firstName lastName email' },
      },
    ]);

    await this.notificationsService.sendAppointmentConfirmation(
      savedAppointment,
    );

    return savedAppointment;
  }

  async findAll(): Promise<Appointment[]> {
    return this.appointmentModel
      .find()
      .populate('patientId', 'firstName lastName email')
      .populate({
        path: 'doctorId',
        populate: { path: 'userId', select: 'firstName lastName email' },
      })
      .sort({ appointmentDate: 1, startTime: 1 })
      .exec();
  }

  async findByPatient(patientId: string): Promise<Appointment[]> {
    return this.appointmentModel
      .find({ patientId })
      .populate({
        path: 'doctorId',
        populate: { path: 'userId', select: 'firstName lastName email' },
      })
      .sort({ appointmentDate: -1 })
      .exec();
  }

  async findByDoctor(doctorId: string): Promise<Appointment[]> {
    return this.appointmentModel
      .find({ doctorId })
      .populate('patientId', 'firstName lastName email phone')
      .sort({ appointmentDate: 1, startTime: 1 })
      .exec();
  }

    async findById(appointmentId: string): Promise<Appointment> {
    const appointment = await this.appointmentModel
      .findById(appointmentId)
      .populate('patientId')
      .populate('doctorId')
      .exec();

    if (!appointment) {
      throw new NotFoundException('Appointment not found');
    }

    return appointment;
  }

  async updatePaymentStatus(
    appointmentId: string, 
    paymentData: { isPaid: boolean; paymentId: string; paidAt: Date }
  ): Promise<void> {
    const result = await this.appointmentModel.findByIdAndUpdate(
      appointmentId,
      {
        isPaid: paymentData.isPaid,
        paymentId: paymentData.paymentId,
        paidAt: paymentData.paidAt,
      },
      { new: true }
    );

    if (!result) {
      throw new NotFoundException('Appointment not found');
    }
  }

  async findOne(id: string): Promise<Appointment> {
    const appointment = await this.appointmentModel
      .findById(id)
      .populate('patientId', 'firstName lastName email phone')
      .populate({
        path: 'doctorId',
        populate: { path: 'userId', select: 'firstName lastName email' },
      })
      .exec();

    if (!appointment) {
      throw new NotFoundException('Appointment not found');
    }

    return appointment;
  }

  async update(
    id: string,
    updateAppointmentDto: UpdateAppointmentDto,
  ): Promise<Appointment> {
    const appointment = await this.appointmentModel
      .findByIdAndUpdate(id, updateAppointmentDto, { new: true })
      .populate('patientId', 'firstName lastName email')
      .populate({
        path: 'doctorId',
        populate: { path: 'userId', select: 'firstName lastName email' },
      })
      .exec();

    if (!appointment) {
      throw new NotFoundException('Appointment not found');
    }

    return appointment;
  }

  async cancel(
    id: string,
    cancelledBy: string,
    cancellationReason?: string,
  ): Promise<Appointment> {
    const appointment = await this.findOne(id);

    if (['cancelled', 'completed'].includes(appointment.status)) {
      throw new BadRequestException('Appointment cannot be cancelled');
    }

    const now = new Date();
    const appointmentDateTime = new Date(
      `${appointment.appointmentDate} ${appointment.startTime}`,
    );
    const hoursUntilAppointment =
      (appointmentDateTime.getTime() - now.getTime()) / (1000 * 60 * 60);

    if (hoursUntilAppointment < 24) {
      throw new BadRequestException(
        'Appointment can only be cancelled at least 24 hours in advance',
      );
    }

    const updatedAppointment = await this.update(id, {
      status: 'cancelled',
      cancelledBy,
      cancellationReason,
    });

    if (appointment.isPaid && appointment.paymentId) {
      await this.paymentsService.processRefund(
        appointment.paymentId,
        appointment.consultationFee,
      );
      await this.update(id, {
        refundIssued: true,
        refundAmount: appointment.consultationFee,
      });
    }

    await this.notificationsService.sendAppointmentCancellation(
      updatedAppointment,
    );

    return updatedAppointment;
  }

  async confirmPayment(id: string, paymentId: string): Promise<Appointment> {
    return this.update(id, {
      isPaid: true,
      paymentId,
      status: 'confirmed',
    });
  }

  async completeAppointment(
    id: string,
    notes?: string,
    prescription?: string,
  ): Promise<Appointment> {
    const appointment = await this.update(id, {
      status: 'completed',
      notes,
      prescription,
    });

    // ensure doctorId is treated as ObjectId when incrementing
    await this.doctorsService.incrementConsultations(
      appointment.doctorId.toString(),
    );

    await this.notificationsService.sendAppointmentCompletion(appointment);

    return appointment;
  }

  async getUpcomingAppointments(
    userId: string,
    role: string,
  ): Promise<Appointment[]> {
    const now = new Date();
    const query: Record<string, any> = {
      appointmentDate: { $gte: now },
      status: { $in: ['scheduled', 'confirmed'] },
    };

    if (role === 'patient') {
      query.patientId = userId;
    } else if (role === 'doctor') {
      const doctorProfile = (await this.doctorsService.findByUserId(
        userId,
      )) as DoctorProfileDocument | null;

      if (doctorProfile) {
        // ✅ TypeScript now knows _id exists
        query.doctorId = new Types.ObjectId(doctorProfile._id);
      }
    }

    return this.appointmentModel
      .find(query)
      .populate('patientId', 'firstName lastName email')
      .populate({
        path: 'doctorId',
        populate: { path: 'userId', select: 'firstName lastName email' },
      })
      .sort({ appointmentDate: 1, startTime: 1 })
      .limit(10)
      .exec();
  }

  async generateMeetingLink(appointmentId: string): Promise<string> {
    const meetingLink = `https://meet.consultation-platform.com/room/${appointmentId}`;
    await this.update(appointmentId, { meetingLink });
    return meetingLink;
  }
}

"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppointmentsService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const appointment_schema_1 = require("./schemas/appointment.schema");
const payments_service_1 = require("../payments/payments.service");
const doctors_service_1 = require("../doctors/doctors.service");
const notifications_service_1 = require("../notifications/notifications.service");
let AppointmentsService = class AppointmentsService {
    constructor(appointmentModel, paymentsService, doctorsService, notificationsService) {
        this.appointmentModel = appointmentModel;
        this.paymentsService = paymentsService;
        this.doctorsService = doctorsService;
        this.notificationsService = notificationsService;
    }
    async create(patientId, createAppointmentDto) {
        const existingAppointment = await this.appointmentModel.findOne({
            doctorId: createAppointmentDto.doctorId,
            appointmentDate: createAppointmentDto.appointmentDate,
            startTime: createAppointmentDto.startTime,
            status: { $nin: ['cancelled', 'no-show'] },
        });
        if (existingAppointment) {
            throw new common_1.ConflictException('Time slot is not available');
        }
        const doctor = await this.doctorsService.findOne(createAppointmentDto.doctorId);
        if (!doctor || doctor.verificationStatus !== 'approved') {
            throw new common_1.BadRequestException('Doctor not available');
        }
        const appointment = new this.appointmentModel(Object.assign({ patientId }, createAppointmentDto));
        const savedAppointment = await appointment.save();
        await savedAppointment.populate([
            { path: 'patientId', select: 'firstName lastName email phone' },
            {
                path: 'doctorId',
                populate: { path: 'userId', select: 'firstName lastName email' },
            },
        ]);
        await this.notificationsService.sendAppointmentConfirmation(savedAppointment);
        return savedAppointment;
    }
    async findAll() {
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
    async findByPatient(patientId) {
        return this.appointmentModel
            .find({ patientId })
            .populate({
            path: 'doctorId',
            populate: { path: 'userId', select: 'firstName lastName email' },
        })
            .sort({ appointmentDate: -1 })
            .exec();
    }
    async findByDoctor(doctorId) {
        return this.appointmentModel
            .find({ doctorId })
            .populate('patientId', 'firstName lastName email phone')
            .sort({ appointmentDate: 1, startTime: 1 })
            .exec();
    }
    async findById(appointmentId) {
        const appointment = await this.appointmentModel
            .findById(appointmentId)
            .populate('patientId')
            .populate('doctorId')
            .exec();
        if (!appointment) {
            throw new common_1.NotFoundException('Appointment not found');
        }
        return appointment;
    }
    async updatePaymentStatus(appointmentId, paymentData) {
        const result = await this.appointmentModel.findByIdAndUpdate(appointmentId, {
            isPaid: paymentData.isPaid,
            paymentId: paymentData.paymentId,
            paidAt: paymentData.paidAt,
        }, { new: true });
        if (!result) {
            throw new common_1.NotFoundException('Appointment not found');
        }
    }
    async findOne(id) {
        const appointment = await this.appointmentModel
            .findById(id)
            .populate('patientId', 'firstName lastName email phone')
            .populate({
            path: 'doctorId',
            populate: { path: 'userId', select: 'firstName lastName email' },
        })
            .exec();
        if (!appointment) {
            throw new common_1.NotFoundException('Appointment not found');
        }
        return appointment;
    }
    async update(id, updateAppointmentDto) {
        const appointment = await this.appointmentModel
            .findByIdAndUpdate(id, updateAppointmentDto, { new: true })
            .populate('patientId', 'firstName lastName email')
            .populate({
            path: 'doctorId',
            populate: { path: 'userId', select: 'firstName lastName email' },
        })
            .exec();
        if (!appointment) {
            throw new common_1.NotFoundException('Appointment not found');
        }
        return appointment;
    }
    async cancel(id, cancelledBy, cancellationReason) {
        const appointment = await this.findOne(id);
        if (['cancelled', 'completed'].includes(appointment.status)) {
            throw new common_1.BadRequestException('Appointment cannot be cancelled');
        }
        const now = new Date();
        const appointmentDateTime = new Date(`${appointment.appointmentDate} ${appointment.startTime}`);
        const hoursUntilAppointment = (appointmentDateTime.getTime() - now.getTime()) / (1000 * 60 * 60);
        if (hoursUntilAppointment < 24) {
            throw new common_1.BadRequestException('Appointment can only be cancelled at least 24 hours in advance');
        }
        const updatedAppointment = await this.update(id, {
            status: 'cancelled',
            cancelledBy,
            cancellationReason,
        });
        if (appointment.isPaid && appointment.paymentId) {
            await this.paymentsService.processRefund(appointment.paymentId, appointment.consultationFee);
            await this.update(id, {
                refundIssued: true,
                refundAmount: appointment.consultationFee,
            });
        }
        await this.notificationsService.sendAppointmentCancellation(updatedAppointment);
        return updatedAppointment;
    }
    async confirmPayment(id, paymentId) {
        return this.update(id, {
            isPaid: true,
            paymentId,
            status: 'confirmed',
        });
    }
    async completeAppointment(id, notes, prescription) {
        const appointment = await this.update(id, {
            status: 'completed',
            notes,
            prescription,
        });
        await this.doctorsService.incrementConsultations(appointment.doctorId.toString());
        await this.notificationsService.sendAppointmentCompletion(appointment);
        return appointment;
    }
    async getUpcomingAppointments(userId, role) {
        const now = new Date();
        const query = {
            appointmentDate: { $gte: now },
            status: { $in: ['scheduled', 'confirmed'] },
        };
        if (role === 'patient') {
            query.patientId = userId;
        }
        else if (role === 'doctor') {
            const doctorProfile = (await this.doctorsService.findByUserId(userId));
            if (doctorProfile) {
                query.doctorId = new mongoose_2.Types.ObjectId(doctorProfile._id);
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
    async generateMeetingLink(appointmentId) {
        const meetingLink = `https://meet.consultation-platform.com/room/${appointmentId}`;
        await this.update(appointmentId, { meetingLink });
        return meetingLink;
    }
};
AppointmentsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(appointment_schema_1.Appointment.name)),
    __metadata("design:paramtypes", [mongoose_2.Model,
        payments_service_1.PaymentsService,
        doctors_service_1.DoctorsService,
        notifications_service_1.NotificationsService])
], AppointmentsService);
exports.AppointmentsService = AppointmentsService;
//# sourceMappingURL=appointments.service.js.map
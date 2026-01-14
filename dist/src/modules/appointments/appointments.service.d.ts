import { Model } from 'mongoose';
import { Appointment, AppointmentDocument } from './schemas/appointment.schema';
import { CreateAppointmentDto } from './dto/create-appointment.dto';
import { UpdateAppointmentDto } from './dto/update-appointment.dto';
import { PaymentsService } from '../payments/payments.service';
import { DoctorsService } from '../doctors/doctors.service';
import { NotificationsService } from '../notifications/notifications.service';
export declare class AppointmentsService {
    private readonly appointmentModel;
    private readonly paymentsService;
    private readonly doctorsService;
    private readonly notificationsService;
    constructor(appointmentModel: Model<AppointmentDocument>, paymentsService: PaymentsService, doctorsService: DoctorsService, notificationsService: NotificationsService);
    create(patientId: string, createAppointmentDto: CreateAppointmentDto): Promise<Appointment>;
    findAll(): Promise<Appointment[]>;
    findByPatient(patientId: string): Promise<Appointment[]>;
    findByDoctor(doctorId: string): Promise<Appointment[]>;
    findById(appointmentId: string): Promise<Appointment>;
    updatePaymentStatus(appointmentId: string, paymentData: {
        isPaid: boolean;
        paymentId: string;
        paidAt: Date;
    }): Promise<void>;
    findOne(id: string): Promise<Appointment>;
    update(id: string, updateAppointmentDto: UpdateAppointmentDto): Promise<Appointment>;
    cancel(id: string, cancelledBy: string, cancellationReason?: string): Promise<Appointment>;
    confirmPayment(id: string, paymentId: string): Promise<Appointment>;
    completeAppointment(id: string, notes?: string, prescription?: string): Promise<Appointment>;
    getUpcomingAppointments(userId: string, role: string): Promise<Appointment[]>;
    generateMeetingLink(appointmentId: string): Promise<string>;
}

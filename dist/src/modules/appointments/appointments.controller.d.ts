import { AppointmentsService } from './appointments.service';
import { CreateAppointmentDto } from './dto/create-appointment.dto';
import { UpdateAppointmentDto } from './dto/update-appointment.dto';
export declare class AppointmentsController {
    private readonly appointmentsService;
    constructor(appointmentsService: AppointmentsService);
    create(req: any, createAppointmentDto: CreateAppointmentDto): Promise<import("./schemas/appointment.schema").Appointment>;
    findAll(): Promise<import("./schemas/appointment.schema").Appointment[]>;
    getMyAppointments(req: any): Promise<import("./schemas/appointment.schema").Appointment[]>;
    getUpcomingAppointments(req: any): Promise<import("./schemas/appointment.schema").Appointment[]>;
    findOne(id: string): Promise<import("./schemas/appointment.schema").Appointment>;
    update(id: string, updateAppointmentDto: UpdateAppointmentDto): Promise<import("./schemas/appointment.schema").Appointment>;
    cancel(id: string, req: any, body: {
        cancellationReason?: string;
    }): Promise<import("./schemas/appointment.schema").Appointment>;
    complete(id: string, body: {
        notes?: string;
        prescription?: string;
    }): Promise<import("./schemas/appointment.schema").Appointment>;
    generateMeetingLink(id: string): Promise<string>;
}

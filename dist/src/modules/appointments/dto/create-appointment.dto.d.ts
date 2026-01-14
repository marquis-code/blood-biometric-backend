export declare class CreateAppointmentDto {
    doctorId: string;
    appointmentDate: Date;
    startTime: string;
    endTime: string;
    consultationType: string;
    reason?: string;
    consultationFee: number;
}

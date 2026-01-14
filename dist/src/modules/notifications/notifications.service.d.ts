export declare class NotificationsService {
    private emailTransporter;
    private twilioClient;
    constructor();
    sendWelcomeEmail(email: string, firstName: string): Promise<void>;
    sendPasswordResetEmail(email: string, resetToken: string): Promise<void>;
    sendAppointmentConfirmation(appointment: any): Promise<void>;
    sendAppointmentReminder(appointment: any): Promise<void>;
    sendAppointmentCancellation(appointment: any): Promise<void>;
    sendAppointmentCompletion(appointment: any): Promise<void>;
    sendDoctorVerificationUpdate(doctor: any, status: 'approved' | 'rejected', rejectionReason?: string): Promise<void>;
    private sendEmailToPatient;
    private sendEmailToDoctor;
    private sendSMSReminder;
    sendScheduledReminders(): Promise<void>;
}

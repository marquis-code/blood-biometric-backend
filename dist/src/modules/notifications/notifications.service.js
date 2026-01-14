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
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotificationsService = void 0;
const common_1 = require("@nestjs/common");
const nodemailer = require("nodemailer");
const Twilio = require("twilio");
let NotificationsService = class NotificationsService {
    constructor() {
        this.emailTransporter = nodemailer.createTransport({
            host: process.env.EMAIL_HOST,
            port: parseInt(process.env.EMAIL_PORT),
            secure: false,
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS,
            },
        });
        if (process.env.TWILIO_ACCOUNT_SID && process.env.TWILIO_AUTH_TOKEN) {
            if (!process.env.TWILIO_ACCOUNT_SID.startsWith('AC')) {
                console.error('Invalid Twilio Account SID: must start with AC');
                return;
            }
            try {
                this.twilioClient = Twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);
            }
            catch (error) {
                console.error('Failed to initialize Twilio client:', error);
            }
        }
        else {
            console.warn('Twilio credentials not provided, SMS functionality will be disabled');
        }
    }
    async sendWelcomeEmail(email, firstName) {
        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: email,
            subject: 'Welcome to Doctor Consultation Platform',
            html: `
        <h2>Welcome, ${firstName}!</h2>
        <p>Thank you for joining our Doctor Consultation Platform.</p>
        <p>You can now:</p>
        <ul>
            <li>Browse and search for doctors</li>
          <li>Book appointments online</li>
          <li>Have consultations via video, voice, or chat</li>
        </ul>
        <p>Best regards,<br>The Doctor Consultation Team</p>
      `,
        };
        try {
            await this.emailTransporter.sendMail(mailOptions);
        }
        catch (error) {
            console.error('Failed to send welcome email:', error);
        }
    }
    async sendPasswordResetEmail(email, resetToken) {
        const resetUrl = `${process.env.FRONTEND_URL}/reset-password?token=${resetToken}`;
        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: email,
            subject: 'Password Reset Request',
            html: `
        <h2>Password Reset Request</h2>
        <p>You have requested to reset your password. Click the link below to reset it:</p>
        <a href="${resetUrl}" style="background-color: #007bff; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">Reset Password</a>
        <p>This link will expire in 1 hour.</p>
        <p>If you didn't request this, please ignore this email.</p>
        <p>Best regards,<br>The Doctor Consultation Team</p>
      `,
        };
        try {
            await this.emailTransporter.sendMail(mailOptions);
        }
        catch (error) {
            console.error('Failed to send password reset email:', error);
        }
    }
    async sendAppointmentConfirmation(appointment) {
        await this.sendEmailToPatient(appointment, 'Appointment Confirmation', `
      <h2>Appointment Confirmed</h2>
      <p>Your appointment has been confirmed with Dr. ${appointment.doctorId.userId.firstName} ${appointment.doctorId.userId.lastName}.</p>
      <p><strong>Date:</strong> ${new Date(appointment.appointmentDate).toLocaleDateString()}</p>
      <p><strong>Time:</strong> ${appointment.startTime} - ${appointment.endTime}</p>
      <p><strong>Type:</strong> ${appointment.consultationType}</p>
      <p><strong>Fee:</strong> ${appointment.consultationFee}</p>
      <p>You will receive a meeting link before your appointment if it's a video/voice consultation.</p>
    `);
        await this.sendEmailToDoctor(appointment, 'New Appointment Booking', `
      <h2>New Appointment Booking</h2>
      <p>You have a new appointment booking from ${appointment.patientId.firstName} ${appointment.patientId.lastName}.</p>
      <p><strong>Date:</strong> ${new Date(appointment.appointmentDate).toLocaleDateString()}</p>
      <p><strong>Time:</strong> ${appointment.startTime} - ${appointment.endTime}</p>
      <p><strong>Type:</strong> ${appointment.consultationType}</p>
      <p><strong>Reason:</strong> ${appointment.reason || 'Not specified'}</p>
    `);
        await this.sendSMSReminder(appointment.patientId.phone, `Appointment confirmed with Dr. ${appointment.doctorId.userId.firstName} on ${new Date(appointment.appointmentDate).toLocaleDateString()} at ${appointment.startTime}`);
    }
    async sendAppointmentReminder(appointment) {
        const reminderTime = '24 hours';
        await this.sendEmailToPatient(appointment, 'Appointment Reminder', `
      <h2>Appointment Reminder</h2>
      <p>This is a reminder that you have an appointment with Dr. ${appointment.doctorId.userId.firstName} ${appointment.doctorId.userId.lastName} in ${reminderTime}.</p>
      <p><strong>Date:</strong> ${new Date(appointment.appointmentDate).toLocaleDateString()}</p>
      <p><strong>Time:</strong> ${appointment.startTime} - ${appointment.endTime}</p>
      <p><strong>Type:</strong> ${appointment.consultationType}</p>
      ${appointment.meetingLink ? `<p><strong>Meeting Link:</strong> <a href="${appointment.meetingLink}">Join Consultation</a></p>` : ''}
      <p>Please be ready 5 minutes before your scheduled time.</p>
    `);
        await this.sendSMSReminder(appointment.patientId.phone, `Reminder: Appointment with Dr. ${appointment.doctorId.userId.firstName} tomorrow at ${appointment.startTime}. ${appointment.meetingLink || ''}`);
    }
    async sendAppointmentCancellation(appointment) {
        await this.sendEmailToPatient(appointment, 'Appointment Cancelled', `
      <h2>Appointment Cancelled</h2>
      <p>Your appointment with Dr. ${appointment.doctorId.userId.firstName} ${appointment.doctorId.userId.lastName} has been cancelled.</p>
      <p><strong>Original Date:</strong> ${new Date(appointment.appointmentDate).toLocaleDateString()}</p>
      <p><strong>Original Time:</strong> ${appointment.startTime} - ${appointment.endTime}</p>
      <p><strong>Cancelled by:</strong> ${appointment.cancelledBy === 'patient' ? 'You' : 'Doctor'}</p>
      ${appointment.cancellationReason ? `<p><strong>Reason:</strong> ${appointment.cancellationReason}</p>` : ''}
      ${appointment.refundIssued ? '<p>A refund has been processed and will reflect in your account within 3-5 business days.</p>' : ''}
    `);
        await this.sendEmailToDoctor(appointment, 'Appointment Cancelled', `
      <h2>Appointment Cancelled</h2>
      <p>The appointment with ${appointment.patientId.firstName} ${appointment.patientId.lastName} has been cancelled.</p>
      <p><strong>Original Date:</strong> ${new Date(appointment.appointmentDate).toLocaleDateString()}</p>
      <p><strong>Original Time:</strong> ${appointment.startTime} - ${appointment.endTime}</p>
      <p><strong>Cancelled by:</strong> ${appointment.cancelledBy === 'doctor' ? 'You' : 'Patient'}</p>
      ${appointment.cancellationReason ? `<p><strong>Reason:</strong> ${appointment.cancellationReason}</p>` : ''}
    `);
    }
    async sendAppointmentCompletion(appointment) {
        await this.sendEmailToPatient(appointment, 'Consultation Complete', `
      <h2>Consultation Complete</h2>
      <p>Your consultation with Dr. ${appointment.doctorId.userId.firstName} ${appointment.doctorId.userId.lastName} has been completed.</p>
      <p><strong>Date:</strong> ${new Date(appointment.appointmentDate).toLocaleDateString()}</p>
      <p><strong>Time:</strong> ${appointment.startTime} - ${appointment.endTime}</p>
      ${appointment.notes ? `<p><strong>Doctor's Notes:</strong> ${appointment.notes}</p>` : ''}
      ${appointment.prescription ? `<p><strong>Prescription:</strong> ${appointment.prescription}</p>` : ''}
      <p>Please consider leaving a review for your doctor to help other patients.</p>
      <p><a href="${process.env.FRONTEND_URL}/appointments/${appointment._id}/review" style="background-color: #28a745; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">Leave Review</a></p>
    `);
        await this.sendEmailToDoctor(appointment, 'Consultation Completed', `
      <h2>Consultation Completed</h2>
      <p>Your consultation with ${appointment.patientId.firstName} ${appointment.patientId.lastName} has been marked as complete.</p>
      <p><strong>Date:</strong> ${new Date(appointment.appointmentDate).toLocaleDateString()}</p>
      <p><strong>Time:</strong> ${appointment.startTime} - ${appointment.endTime}</p>
      <p>Your earnings for this consultation will be processed in the next payout cycle.</p>
    `);
    }
    async sendDoctorVerificationUpdate(doctor, status, rejectionReason) {
        const subject = status === 'approved' ? 'Doctor Profile Approved' : 'Doctor Profile Rejected';
        let content = '';
        if (status === 'approved') {
            content = `
        <h2>Congratulations! Your Profile has been Approved</h2>
        <p>Dear Dr. ${doctor.userId.firstName} ${doctor.userId.lastName},</p>
        <p>Your doctor profile has been approved and you can now start accepting appointments.</p>
        <p>You can now:</p>
        <ul>
          <li>Set your availability</li>
          <li>Accept appointment bookings</li>
          <li>Conduct consultations</li>
          <li>Receive payments</li>
        </ul>
        <p><a href="${process.env.FRONTEND_URL}/doctor/dashboard" style="background-color: #007bff; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">Go to Dashboard</a></p>
      `;
        }
        else {
            content = `
        <h2>Profile Verification Update</h2>
        <p>Dear Dr. ${doctor.userId.firstName} ${doctor.userId.lastName},</p>
        <p>Unfortunately, your doctor profile could not be approved at this time.</p>
        ${rejectionReason ? `<p><strong>Reason:</strong> ${rejectionReason}</p>` : ''}
        <p>Please review the requirements and resubmit your profile with the necessary corrections.</p>
        <p><a href="${process.env.FRONTEND_URL}/doctor/profile/edit" style="background-color: #dc3545; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">Edit Profile</a></p>
      `;
        }
        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: doctor.userId.email,
            subject,
            html: content + '<p>Best regards,<br>The Doctor Consultation Team</p>',
        };
        try {
            await this.emailTransporter.sendMail(mailOptions);
        }
        catch (error) {
            console.error('Failed to send doctor verification email:', error);
        }
    }
    async sendEmailToPatient(appointment, subject, content) {
        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: appointment.patientId.email,
            subject,
            html: content + '<p>Best regards,<br>The Doctor Consultation Team</p>',
        };
        try {
            await this.emailTransporter.sendMail(mailOptions);
        }
        catch (error) {
            console.error('Failed to send email to patient:', error);
        }
    }
    async sendEmailToDoctor(appointment, subject, content) {
        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: appointment.doctorId.userId.email,
            subject,
            html: content + '<p>Best regards,<br>The Doctor Consultation Team</p>',
        };
        try {
            await this.emailTransporter.sendMail(mailOptions);
        }
        catch (error) {
            console.error('Failed to send email to doctor:', error);
        }
    }
    async sendSMSReminder(phoneNumber, message) {
        if (!this.twilioClient || !phoneNumber)
            return;
        try {
            await this.twilioClient.messages.create({
                body: message,
                from: process.env.TWILIO_PHONE_NUMBER,
                to: phoneNumber,
            });
        }
        catch (error) {
            console.error('Failed to send SMS:', error);
        }
    }
    async sendScheduledReminders() {
        console.log('Sending scheduled appointment reminders...');
    }
};
NotificationsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [])
], NotificationsService);
exports.NotificationsService = NotificationsService;
//# sourceMappingURL=notifications.service.js.map
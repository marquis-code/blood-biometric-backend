/// <reference types="node" />
/// <reference types="node" />
import { Model } from 'mongoose';
import { Transaction, TransactionDocument } from './schemas/transaction.schema';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { AppointmentsService } from '../appointments/appointments.service';
import { DoctorsService } from '../doctors/doctors.service';
export declare class PaymentsService {
    private transactionModel;
    private appointmentsService;
    private doctorsService;
    private stripe;
    constructor(transactionModel: Model<TransactionDocument>, appointmentsService: AppointmentsService, doctorsService: DoctorsService);
    createPaymentIntent(patientId: string, createPaymentDto: CreatePaymentDto): Promise<{
        clientSecret: string;
        transactionId: string;
    }>;
    confirmPayment(transactionId: string): Promise<void>;
    handleWebhook(signature: string, payload: Buffer): Promise<void>;
    private handlePaymentSucceeded;
    private handlePaymentFailed;
    processRefund(paymentIntentId: string, amount: number): Promise<void>;
    getDoctorEarnings(doctorId: string): Promise<{
        total: number;
        pending: number;
        paid: number;
    }>;
    processDoctorPayout(doctorId: string): Promise<void>;
    getTransactionHistory(userId: string, role: string): Promise<Transaction[]>;
    getPlatformRevenue(): Promise<{
        total: number;
        thisMonth: number;
        lastMonth: number;
    }>;
    private getAppointmentDetails;
    private updateAppointmentPayment;
    private getDoctorProfile;
    getTransactionById(transactionId: string): Promise<Transaction>;
    cancelPayment(transactionId: string): Promise<void>;
}

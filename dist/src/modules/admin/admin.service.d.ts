import { Model } from 'mongoose';
import { UserDocument } from '../users/schemas/user.schema';
import { DoctorProfile, DoctorProfileDocument } from '../doctors/schemas/doctor-profile.schema';
import { Appointment, AppointmentDocument } from '../appointments/schemas/appointment.schema';
import { Transaction, TransactionDocument } from '../payments/schemas/transaction.schema';
import { ReviewDocument } from '../reviews/schemas/review.schema';
export declare class AdminService {
    private userModel;
    private doctorProfileModel;
    private appointmentModel;
    private transactionModel;
    private reviewModel;
    constructor(userModel: Model<UserDocument>, doctorProfileModel: Model<DoctorProfileDocument>, appointmentModel: Model<AppointmentDocument>, transactionModel: Model<TransactionDocument>, reviewModel: Model<ReviewDocument>);
    getDashboardStats(): Promise<{
        users: {
            total: number;
            patients: number;
            doctors: number;
            newThisMonth: number;
        };
        appointments: {
            total: number;
            completed: number;
            cancelled: number;
            thisMonth: number;
        };
        revenue: {
            total: number;
            thisMonth: number;
            lastMonth: number;
        };
        reviews: {
            total: number;
            averageRating: number;
        };
    }>;
    getPendingDoctorVerifications(): Promise<DoctorProfile[]>;
    getRecentTransactions(limit?: number): Promise<Transaction[]>;
    getRecentAppointments(limit?: number): Promise<Appointment[]>;
    getUserGrowthData(): Promise<Array<{
        month: string;
        patients: number;
        doctors: number;
    }>>;
    getRevenueGrowthData(): Promise<Array<{
        month: string;
        revenue: number;
        transactions: number;
    }>>;
    getTopDoctors(limit?: number): Promise<any[]>;
    getSystemHealth(): Promise<{
        database: 'healthy' | 'unhealthy';
        email: 'healthy' | 'unhealthy';
        payment: 'healthy' | 'unhealthy';
        uptime: number;
    }>;
    exportData(type: 'users' | 'appointments' | 'transactions', startDate?: Date, endDate?: Date): Promise<any[]>;
}

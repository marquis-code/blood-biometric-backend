import { AdminService } from './admin.service';
export declare class AdminController {
    private readonly adminService;
    constructor(adminService: AdminService);
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
    getPendingDoctorVerifications(): Promise<import("../doctors/schemas/doctor-profile.schema").DoctorProfile[]>;
    getRecentTransactions(limit?: string): Promise<import("../payments/schemas/transaction.schema").Transaction[]>;
    getRecentAppointments(limit?: string): Promise<import("../appointments/schemas/appointment.schema").Appointment[]>;
    getUserGrowthData(): Promise<{
        month: string;
        patients: number;
        doctors: number;
    }[]>;
    getRevenueGrowthData(): Promise<{
        month: string;
        revenue: number;
        transactions: number;
    }[]>;
    getTopDoctors(limit?: string): Promise<any[]>;
    getSystemHealth(): Promise<{
        database: "healthy" | "unhealthy";
        email: "healthy" | "unhealthy";
        payment: "healthy" | "unhealthy";
        uptime: number;
    }>;
    exportData(type: 'users' | 'appointments' | 'transactions', startDate?: string, endDate?: string): Promise<any[]>;
}

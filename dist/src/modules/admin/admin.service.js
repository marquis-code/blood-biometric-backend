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
exports.AdminService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const user_schema_1 = require("../users/schemas/user.schema");
const doctor_profile_schema_1 = require("../doctors/schemas/doctor-profile.schema");
const appointment_schema_1 = require("../appointments/schemas/appointment.schema");
const transaction_schema_1 = require("../payments/schemas/transaction.schema");
const review_schema_1 = require("../reviews/schemas/review.schema");
let AdminService = class AdminService {
    constructor(userModel, doctorProfileModel, appointmentModel, transactionModel, reviewModel) {
        this.userModel = userModel;
        this.doctorProfileModel = doctorProfileModel;
        this.appointmentModel = appointmentModel;
        this.transactionModel = transactionModel;
        this.reviewModel = reviewModel;
    }
    async getDashboardStats() {
        var _a;
        const now = new Date();
        const startOfThisMonth = new Date(now.getFullYear(), now.getMonth(), 1);
        const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
        const totalUsers = await this.userModel.countDocuments({ isActive: true });
        const totalPatients = await this.userModel.countDocuments({ role: 'patient', isActive: true });
        const totalDoctors = await this.userModel.countDocuments({ role: 'doctor', isActive: true });
        const newUsersThisMonth = await this.userModel.countDocuments({
            isActive: true,
            createdAt: { $gte: startOfThisMonth }
        });
        const totalAppointments = await this.appointmentModel.countDocuments();
        const completedAppointments = await this.appointmentModel.countDocuments({ status: 'completed' });
        const cancelledAppointments = await this.appointmentModel.countDocuments({ status: 'cancelled' });
        const appointmentsThisMonth = await this.appointmentModel.countDocuments({
            createdAt: { $gte: startOfThisMonth }
        });
        const revenueStats = await this.transactionModel.aggregate([
            { $match: { status: 'succeeded' } },
            {
                $group: {
                    _id: null,
                    total: { $sum: '$platformFee' },
                    thisMonth: {
                        $sum: {
                            $cond: [
                                { $gte: ['$createdAt', startOfThisMonth] },
                                '$platformFee',
                                0
                            ]
                        }
                    },
                    lastMonth: {
                        $sum: {
                            $cond: [
                                {
                                    $and: [
                                        { $gte: ['$createdAt', startOfLastMonth] },
                                        { $lt: ['$createdAt', startOfThisMonth] }
                                    ]
                                },
                                '$platformFee',
                                0
                            ]
                        }
                    }
                }
            }
        ]);
        const totalReviews = await this.reviewModel.countDocuments({ isVisible: true });
        const averageRatingResult = await this.reviewModel.aggregate([
            { $match: { isVisible: true } },
            { $group: { _id: null, averageRating: { $avg: '$rating' } } }
        ]);
        const revenue = revenueStats[0] || { total: 0, thisMonth: 0, lastMonth: 0 };
        const averageRating = ((_a = averageRatingResult[0]) === null || _a === void 0 ? void 0 : _a.averageRating) || 0;
        return {
            users: {
                total: totalUsers,
                patients: totalPatients,
                doctors: totalDoctors,
                newThisMonth: newUsersThisMonth
            },
            appointments: {
                total: totalAppointments,
                completed: completedAppointments,
                cancelled: cancelledAppointments,
                thisMonth: appointmentsThisMonth
            },
            revenue,
            reviews: {
                total: totalReviews,
                averageRating: Number(averageRating.toFixed(2))
            }
        };
    }
    async getPendingDoctorVerifications() {
        return this.doctorProfileModel
            .find({ verificationStatus: 'pending' })
            .populate('userId', 'firstName lastName email phone createdAt')
            .sort({ createdAt: 1 })
            .exec();
    }
    async getRecentTransactions(limit = 50) {
        return this.transactionModel
            .find()
            .populate('patientId', 'firstName lastName email')
            .populate({
            path: 'doctorId',
            populate: { path: 'userId', select: 'firstName lastName email' }
        })
            .populate('appointmentId', 'appointmentDate startTime consultationType')
            .sort({ createdAt: -1 })
            .limit(limit)
            .exec();
    }
    async getRecentAppointments(limit = 50) {
        return this.appointmentModel
            .find()
            .populate('patientId', 'firstName lastName email')
            .populate({
            path: 'doctorId',
            populate: { path: 'userId', select: 'firstName lastName email' }
        })
            .sort({ createdAt: -1 })
            .limit(limit)
            .exec();
    }
    async getUserGrowthData() {
        const sixMonthsAgo = new Date();
        sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
        const growthData = await this.userModel.aggregate([
            {
                $match: {
                    isActive: true,
                    createdAt: { $gte: sixMonthsAgo }
                }
            },
            {
                $group: {
                    _id: {
                        year: { $year: '$createdAt' },
                        month: { $month: '$createdAt' },
                        role: '$role'
                    },
                    count: { $sum: 1 }
                }
            },
            {
                $group: {
                    _id: {
                        year: '$_id.year',
                        month: '$_id.month'
                    },
                    patients: {
                        $sum: {
                            $cond: [{ $eq: ['$_id.role', 'patient'] }, '$count', 0]
                        }
                    },
                    doctors: {
                        $sum: {
                            $cond: [{ $eq: ['$_id.role', 'doctor'] }, '$count', 0]
                        }
                    }
                }
            },
            {
                $sort: { '_id.year': 1, '_id.month': 1 }
            }
        ]);
        return growthData.map(item => ({
            month: `${item._id.year}-${item._id.month.toString().padStart(2, '0')}`,
            patients: item.patients,
            doctors: item.doctors
        }));
    }
    async getRevenueGrowthData() {
        const sixMonthsAgo = new Date();
        sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
        const revenueData = await this.transactionModel.aggregate([
            {
                $match: {
                    status: 'succeeded',
                    createdAt: { $gte: sixMonthsAgo }
                }
            },
            {
                $group: {
                    _id: {
                        year: { $year: '$createdAt' },
                        month: { $month: '$createdAt' }
                    },
                    revenue: { $sum: '$platformFee' },
                    transactions: { $sum: 1 }
                }
            },
            {
                $sort: { '_id.year': 1, '_id.month': 1 }
            }
        ]);
        return revenueData.map(item => ({
            month: `${item._id.year}-${item._id.month.toString().padStart(2, '0')}`,
            revenue: item.revenue,
            transactions: item.transactions
        }));
    }
    async getTopDoctors(limit = 10) {
        return this.doctorProfileModel
            .find({ verificationStatus: 'approved', isActive: true })
            .populate('userId', 'firstName lastName email')
            .sort({ averageRating: -1, totalConsultations: -1 })
            .limit(limit)
            .select('userId specialties averageRating totalReviews totalConsultations consultationFee')
            .exec();
    }
    async getSystemHealth() {
        let databaseHealth = 'healthy';
        let emailHealth = 'healthy';
        let paymentHealth = 'healthy';
        try {
            await this.userModel.findOne().limit(1);
        }
        catch (error) {
            databaseHealth = 'unhealthy';
        }
        return {
            database: databaseHealth,
            email: emailHealth,
            payment: paymentHealth,
            uptime: process.uptime()
        };
    }
    async exportData(type, startDate, endDate) {
        const dateFilter = {};
        if (startDate && endDate) {
            dateFilter.createdAt = { $gte: startDate, $lte: endDate };
        }
        switch (type) {
            case 'users':
                return this.userModel
                    .find(Object.assign({ isActive: true }, dateFilter))
                    .select('-password -resetPasswordToken -verificationToken')
                    .lean()
                    .exec();
            case 'appointments':
                return this.appointmentModel
                    .find(dateFilter)
                    .populate('patientId', 'firstName lastName email')
                    .populate({
                    path: 'doctorId',
                    populate: { path: 'userId', select: 'firstName lastName email' }
                })
                    .lean()
                    .exec();
            case 'transactions':
                return this.transactionModel
                    .find(dateFilter)
                    .populate('patientId', 'firstName lastName email')
                    .populate({
                    path: 'doctorId',
                    populate: { path: 'userId', select: 'firstName lastName email' }
                })
                    .lean()
                    .exec();
            default:
                return [];
        }
    }
};
AdminService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(user_schema_1.User.name)),
    __param(1, (0, mongoose_1.InjectModel)(doctor_profile_schema_1.DoctorProfile.name)),
    __param(2, (0, mongoose_1.InjectModel)(appointment_schema_1.Appointment.name)),
    __param(3, (0, mongoose_1.InjectModel)(transaction_schema_1.Transaction.name)),
    __param(4, (0, mongoose_1.InjectModel)(review_schema_1.Review.name)),
    __metadata("design:paramtypes", [mongoose_2.Model,
        mongoose_2.Model,
        mongoose_2.Model,
        mongoose_2.Model,
        mongoose_2.Model])
], AdminService);
exports.AdminService = AdminService;
//# sourceMappingURL=admin.service.js.map
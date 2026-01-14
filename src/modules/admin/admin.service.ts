import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from '../users/schemas/user.schema';
import { DoctorProfile, DoctorProfileDocument } from '../doctors/schemas/doctor-profile.schema';
import { Appointment, AppointmentDocument } from '../appointments/schemas/appointment.schema';
import { Transaction, TransactionDocument } from '../payments/schemas/transaction.schema';
import { Review, ReviewDocument } from '../reviews/schemas/review.schema';

@Injectable()
export class AdminService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    @InjectModel(DoctorProfile.name) private doctorProfileModel: Model<DoctorProfileDocument>,
    @InjectModel(Appointment.name) private appointmentModel: Model<AppointmentDocument>,
    @InjectModel(Transaction.name) private transactionModel: Model<TransactionDocument>,
    @InjectModel(Review.name) private reviewModel: Model<ReviewDocument>,
  ) {}

  async getDashboardStats(): Promise<{
    users: { total: number; patients: number; doctors: number; newThisMonth: number };
    appointments: { total: number; completed: number; cancelled: number; thisMonth: number };
    revenue: { total: number; thisMonth: number; lastMonth: number };
    reviews: { total: number; averageRating: number };
  }> {
    const now = new Date();
    const startOfThisMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);

    // User statistics
    const totalUsers = await this.userModel.countDocuments({ isActive: true });
    const totalPatients = await this.userModel.countDocuments({ role: 'patient', isActive: true });
    const totalDoctors = await this.userModel.countDocuments({ role: 'doctor', isActive: true });
    const newUsersThisMonth = await this.userModel.countDocuments({
      isActive: true,
      createdAt: { $gte: startOfThisMonth }
    });

    // Appointment statistics
    const totalAppointments = await this.appointmentModel.countDocuments();
    const completedAppointments = await this.appointmentModel.countDocuments({ status: 'completed' });
    const cancelledAppointments = await this.appointmentModel.countDocuments({ status: 'cancelled' });
    const appointmentsThisMonth = await this.appointmentModel.countDocuments({
      createdAt: { $gte: startOfThisMonth }
    });

    // Revenue statistics
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

    // Review statistics
    const totalReviews = await this.reviewModel.countDocuments({ isVisible: true });
    const averageRatingResult = await this.reviewModel.aggregate([
      { $match: { isVisible: true } },
      { $group: { _id: null, averageRating: { $avg: '$rating' } } }
    ]);

    const revenue = revenueStats[0] || { total: 0, thisMonth: 0, lastMonth: 0 };
    const averageRating = averageRatingResult[0]?.averageRating || 0;

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

  async getPendingDoctorVerifications(): Promise<DoctorProfile[]> {
    return this.doctorProfileModel
      .find({ verificationStatus: 'pending' })
      .populate('userId', 'firstName lastName email phone createdAt')
      .sort({ createdAt: 1 })
      .exec();
  }

  async getRecentTransactions(limit: number = 50): Promise<Transaction[]> {
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

  async getRecentAppointments(limit: number = 50): Promise<Appointment[]> {
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

  async getUserGrowthData(): Promise<Array<{ month: string; patients: number; doctors: number }>> {
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

  async getRevenueGrowthData(): Promise<Array<{ month: string; revenue: number; transactions: number }>> {
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

  async getTopDoctors(limit: number = 10): Promise<any[]> {
    return this.doctorProfileModel
      .find({ verificationStatus: 'approved', isActive: true })
      .populate('userId', 'firstName lastName email')
      .sort({ averageRating: -1, totalConsultations: -1 })
      .limit(limit)
      .select('userId specialties averageRating totalReviews totalConsultations consultationFee')
      .exec();
  }

  async getSystemHealth(): Promise<{
    database: 'healthy' | 'unhealthy';
    email: 'healthy' | 'unhealthy';
    payment: 'healthy' | 'unhealthy';
    uptime: number;
  }> {
    // Simple health checks
    let databaseHealth: 'healthy' | 'unhealthy' = 'healthy';
    let emailHealth: 'healthy' | 'unhealthy' = 'healthy';
    let paymentHealth: 'healthy' | 'unhealthy' = 'healthy';

    try {
      // Test database connectivity
      await this.userModel.findOne().limit(1);
    } catch (error) {
      databaseHealth = 'unhealthy';
    }

    // Email and payment health would require actual service checks
    // For now, we'll assume they're healthy

    return {
      database: databaseHealth,
      email: emailHealth,
      payment: paymentHealth,
      uptime: process.uptime()
    };
  }

  async exportData(type: 'users' | 'appointments' | 'transactions', startDate?: Date, endDate?: Date): Promise<any[]> {
    const dateFilter: any = {};
    if (startDate && endDate) {
      dateFilter.createdAt = { $gte: startDate, $lte: endDate };
    }

    switch (type) {
      case 'users':
        return this.userModel
          .find({ isActive: true, ...dateFilter })
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
}
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
exports.PaymentsService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const transaction_schema_1 = require("./schemas/transaction.schema");
const stripe_1 = require("stripe");
const appointments_service_1 = require("../appointments/appointments.service");
const doctors_service_1 = require("../doctors/doctors.service");
let PaymentsService = class PaymentsService {
    constructor(transactionModel, appointmentsService, doctorsService) {
        this.transactionModel = transactionModel;
        this.appointmentsService = appointmentsService;
        this.doctorsService = doctorsService;
        this.stripe = new stripe_1.default(process.env.STRIPE_SECRET_KEY, {
            apiVersion: '2023-10-16',
        });
    }
    async createPaymentIntent(patientId, createPaymentDto) {
        const appointment = await this.getAppointmentDetails(createPaymentDto.appointmentId);
        if (appointment.patientId.toString() !== patientId) {
            throw new common_1.BadRequestException('Unauthorized to pay for this appointment');
        }
        if (appointment.isPaid) {
            throw new common_1.BadRequestException('Appointment already paid');
        }
        const platformFeePercent = 0.10;
        const platformFee = Math.round(createPaymentDto.amount * platformFeePercent);
        const doctorEarnings = createPaymentDto.amount - platformFee;
        const paymentIntent = await this.stripe.paymentIntents.create({
            amount: Math.round(createPaymentDto.amount * 100),
            currency: 'usd',
            payment_method: createPaymentDto.paymentMethodId,
            confirmation_method: 'manual',
            confirm: true,
            return_url: `${process.env.FRONTEND_URL}/payment/success`,
            metadata: {
                appointmentId: createPaymentDto.appointmentId,
                patientId,
                doctorId: appointment.doctorId.toString(),
            },
        });
        const transaction = new this.transactionModel({
            patientId,
            doctorId: appointment.doctorId,
            appointmentId: createPaymentDto.appointmentId,
            amount: createPaymentDto.amount,
            platformFee,
            doctorEarnings,
            stripePaymentIntentId: paymentIntent.id,
            status: paymentIntent.status === 'succeeded' ? 'succeeded' : 'pending',
        });
        const savedTransaction = await transaction.save();
        if (paymentIntent.status === 'succeeded') {
            await this.confirmPayment(savedTransaction._id.toString());
        }
        return {
            clientSecret: paymentIntent.client_secret,
            transactionId: savedTransaction._id.toString(),
        };
    }
    async confirmPayment(transactionId) {
        const transaction = await this.transactionModel.findById(transactionId);
        if (!transaction) {
            throw new common_1.NotFoundException('Transaction not found');
        }
        await this.transactionModel.findByIdAndUpdate(transactionId, {
            status: 'succeeded',
        });
        await this.updateAppointmentPayment(transaction.appointmentId.toString(), transaction.stripePaymentIntentId);
    }
    async handleWebhook(signature, payload) {
        let event;
        try {
            event = this.stripe.webhooks.constructEvent(payload, signature, process.env.STRIPE_WEBHOOK_SECRET);
        }
        catch (err) {
            throw new common_1.BadRequestException(`Webhook signature verification failed: ${err.message}`);
        }
        switch (event.type) {
            case 'payment_intent.succeeded':
                await this.handlePaymentSucceeded(event.data.object);
                break;
            case 'payment_intent.payment_failed':
                await this.handlePaymentFailed(event.data.object);
                break;
            default:
                console.log(`Unhandled event type ${event.type}`);
        }
    }
    async handlePaymentSucceeded(paymentIntent) {
        const transaction = await this.transactionModel.findOne({
            stripePaymentIntentId: paymentIntent.id,
        });
        if (transaction) {
            await this.confirmPayment(transaction._id.toString());
        }
    }
    async handlePaymentFailed(paymentIntent) {
        var _a;
        await this.transactionModel.findOneAndUpdate({ stripePaymentIntentId: paymentIntent.id }, {
            status: 'failed',
            failureReason: ((_a = paymentIntent.last_payment_error) === null || _a === void 0 ? void 0 : _a.message) || 'Payment failed',
        });
    }
    async processRefund(paymentIntentId, amount) {
        try {
            const refund = await this.stripe.refunds.create({
                payment_intent: paymentIntentId,
                amount: Math.round(amount * 100),
            });
            await this.transactionModel.findOneAndUpdate({ stripePaymentIntentId: paymentIntentId }, {
                status: 'refunded',
                refundId: refund.id,
                refundAmount: amount,
            });
        }
        catch (error) {
            throw new common_1.BadRequestException(`Refund failed: ${error.message}`);
        }
    }
    async getDoctorEarnings(doctorId) {
        const doctorProfile = await this.getDoctorProfile(doctorId);
        if (!doctorProfile) {
            throw new common_1.NotFoundException('Doctor profile not found');
        }
        const earnings = await this.transactionModel.aggregate([
            { $match: { doctorId: doctorProfile._id, status: 'succeeded' } },
            {
                $group: {
                    _id: null,
                    total: { $sum: '$doctorEarnings' },
                    pending: {
                        $sum: {
                            $cond: [{ $eq: ['$doctorPaid', false] }, '$doctorEarnings', 0],
                        },
                    },
                    paid: {
                        $sum: {
                            $cond: [{ $eq: ['$doctorPaid', true] }, '$doctorEarnings', 0],
                        },
                    },
                },
            },
        ]);
        return earnings[0] || { total: 0, pending: 0, paid: 0 };
    }
    async processDoctorPayout(doctorId) {
        const doctor = await this.getDoctorProfile(doctorId);
        if (!doctor) {
            throw new common_1.NotFoundException('Doctor profile not found');
        }
        if (!doctor.stripeConnectId) {
            throw new common_1.BadRequestException('Doctor has not connected their Stripe account');
        }
        const pendingTransactions = await this.transactionModel.find({
            doctorId: doctor._id,
            status: 'succeeded',
            doctorPaid: false,
        });
        if (pendingTransactions.length === 0) {
            throw new common_1.BadRequestException('No pending earnings to pay out');
        }
        const totalAmount = pendingTransactions.reduce((sum, transaction) => sum + transaction.doctorEarnings, 0);
        try {
            const transfer = await this.stripe.transfers.create({
                amount: Math.round(totalAmount * 100),
                currency: 'usd',
                destination: doctor.stripeConnectId,
            });
            await this.transactionModel.updateMany({ _id: { $in: pendingTransactions.map(t => t._id) } }, {
                doctorPaid: true,
                doctorPayoutId: transfer.id,
            });
        }
        catch (error) {
            throw new common_1.BadRequestException(`Payout failed: ${error.message}`);
        }
    }
    async getTransactionHistory(userId, role) {
        const query = { status: 'succeeded' };
        if (role === 'patient') {
            query.patientId = userId;
        }
        else if (role === 'doctor') {
            const doctorProfile = await this.getDoctorProfile(userId);
            if (doctorProfile) {
                query.doctorId = doctorProfile._id;
            }
            else {
                return [];
            }
        }
        return this.transactionModel
            .find(query)
            .populate('patientId', 'firstName lastName email')
            .populate({
            path: 'doctorId',
            populate: { path: 'userId', select: 'firstName lastName email' },
        })
            .populate('appointmentId', 'appointmentDate startTime consultationType')
            .sort({ createdAt: -1 })
            .exec();
    }
    async getPlatformRevenue() {
        const now = new Date();
        const startOfThisMonth = new Date(now.getFullYear(), now.getMonth(), 1);
        const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
        const revenue = await this.transactionModel.aggregate([
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
                                0,
                            ],
                        },
                    },
                    lastMonth: {
                        $sum: {
                            $cond: [
                                {
                                    $and: [
                                        { $gte: ['$createdAt', startOfLastMonth] },
                                        { $lt: ['$createdAt', startOfThisMonth] },
                                    ],
                                },
                                '$platformFee',
                                0,
                            ],
                        },
                    },
                },
            },
        ]);
        return revenue[0] || { total: 0, thisMonth: 0, lastMonth: 0 };
    }
    async getAppointmentDetails(appointmentId) {
        try {
            const appointment = await this.appointmentsService.findById(appointmentId);
            if (!appointment) {
                throw new common_1.NotFoundException('Appointment not found');
            }
            return appointment;
        }
        catch (error) {
            if (error instanceof common_1.NotFoundException) {
                throw error;
            }
            throw new common_1.BadRequestException('Failed to fetch appointment details');
        }
    }
    async updateAppointmentPayment(appointmentId, paymentId) {
        try {
            await this.appointmentsService.updatePaymentStatus(appointmentId, {
                isPaid: true,
                paymentId,
                paidAt: new Date(),
            });
        }
        catch (error) {
            console.error('Failed to update appointment payment status:', error);
        }
    }
    async getDoctorProfile(userId) {
        try {
            const doctorProfile = await this.doctorsService.findByUserId(userId);
            return doctorProfile;
        }
        catch (error) {
            console.error('Failed to fetch doctor profile:', error);
            return null;
        }
    }
    async getTransactionById(transactionId) {
        const transaction = await this.transactionModel
            .findById(transactionId)
            .populate('patientId', 'firstName lastName email')
            .populate({
            path: 'doctorId',
            populate: { path: 'userId', select: 'firstName lastName email' },
        })
            .populate('appointmentId', 'appointmentDate startTime consultationType')
            .exec();
        if (!transaction) {
            throw new common_1.NotFoundException('Transaction not found');
        }
        return transaction;
    }
    async cancelPayment(transactionId) {
        const transaction = await this.transactionModel.findById(transactionId);
        if (!transaction) {
            throw new common_1.NotFoundException('Transaction not found');
        }
        if (transaction.status !== 'pending') {
            throw new common_1.BadRequestException('Cannot cancel non-pending transaction');
        }
        try {
            await this.stripe.paymentIntents.cancel(transaction.stripePaymentIntentId);
            await this.transactionModel.findByIdAndUpdate(transactionId, {
                status: 'cancelled',
            });
        }
        catch (error) {
            throw new common_1.BadRequestException(`Failed to cancel payment: ${error.message}`);
        }
    }
};
PaymentsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(transaction_schema_1.Transaction.name)),
    __param(1, (0, common_1.Inject)((0, common_1.forwardRef)(() => appointments_service_1.AppointmentsService))),
    __param(2, (0, common_1.Inject)((0, common_1.forwardRef)(() => doctors_service_1.DoctorsService))),
    __metadata("design:paramtypes", [mongoose_2.Model,
        appointments_service_1.AppointmentsService,
        doctors_service_1.DoctorsService])
], PaymentsService);
exports.PaymentsService = PaymentsService;
//# sourceMappingURL=payments.service.js.map
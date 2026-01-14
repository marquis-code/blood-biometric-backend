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
exports.ReviewsService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const review_schema_1 = require("./schemas/review.schema");
const doctors_service_1 = require("../doctors/doctors.service");
let ReviewsService = class ReviewsService {
    constructor(reviewModel, doctorsService) {
        this.reviewModel = reviewModel;
        this.doctorsService = doctorsService;
    }
    async create(patientId, createReviewDto) {
        const existingReview = await this.reviewModel.findOne({
            appointmentId: createReviewDto.appointmentId,
            patientId,
        });
        if (existingReview) {
            throw new common_1.ConflictException('Review already exists for this appointment');
        }
        const appointment = await this.verifyAppointment(createReviewDto.appointmentId, patientId, createReviewDto.doctorId);
        if (appointment.status !== 'completed') {
            throw new common_1.BadRequestException('Can only review completed appointments');
        }
        const review = new this.reviewModel(Object.assign({ patientId }, createReviewDto));
        const savedReview = await review.save();
        await this.doctorsService.updateRating(createReviewDto.doctorId, createReviewDto.rating);
        await savedReview.populate([
            { path: 'patientId', select: 'firstName lastName' },
            { path: 'doctorId', populate: { path: 'userId', select: 'firstName lastName' } }
        ]);
        return savedReview;
    }
    async findByDoctor(doctorId) {
        return this.reviewModel
            .find({ doctorId, isVisible: true })
            .populate('patientId', 'firstName lastName')
            .sort({ createdAt: -1 })
            .exec();
    }
    async findByPatient(patientId) {
        return this.reviewModel
            .find({ patientId })
            .populate({
            path: 'doctorId',
            populate: { path: 'userId', select: 'firstName lastName' }
        })
            .sort({ createdAt: -1 })
            .exec();
    }
    async findOne(id) {
        const review = await this.reviewModel
            .findById(id)
            .populate('patientId', 'firstName lastName')
            .populate({
            path: 'doctorId',
            populate: { path: 'userId', select: 'firstName lastName' }
        })
            .exec();
        if (!review) {
            throw new common_1.NotFoundException('Review not found');
        }
        return review;
    }
    async addDoctorResponse(reviewId, doctorId, response) {
        const review = await this.reviewModel.findById(reviewId);
        if (!review) {
            throw new common_1.NotFoundException('Review not found');
        }
        if (review.doctorId.toString() !== doctorId) {
            throw new common_1.BadRequestException('Unauthorized to respond to this review');
        }
        const updatedReview = await this.reviewModel
            .findByIdAndUpdate(reviewId, {
            doctorResponse: response,
            doctorResponseDate: new Date(),
        }, { new: true })
            .populate('patientId', 'firstName lastName')
            .exec();
        return updatedReview;
    }
    async hideReview(reviewId) {
        const result = await this.reviewModel.findByIdAndUpdate(reviewId, { isVisible: false }, { new: true });
        if (!result) {
            throw new common_1.NotFoundException('Review not found');
        }
    }
    async getDoctorRatingStats(doctorId) {
        const reviews = await this.reviewModel.find({ doctorId, isVisible: true });
        if (reviews.length === 0) {
            return {
                averageRating: 0,
                totalReviews: 0,
                ratingDistribution: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 },
            };
        }
        const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);
        const averageRating = totalRating / reviews.length;
        const ratingDistribution = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
        reviews.forEach(review => {
            ratingDistribution[review.rating]++;
        });
        return {
            averageRating: Number(averageRating.toFixed(2)),
            totalReviews: reviews.length,
            ratingDistribution,
        };
    }
    async verifyAppointment(appointmentId, patientId, doctorId) {
        return {
            _id: appointmentId,
            patientId,
            doctorId,
            status: 'completed',
        };
    }
};
ReviewsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(review_schema_1.Review.name)),
    __metadata("design:paramtypes", [mongoose_2.Model,
        doctors_service_1.DoctorsService])
], ReviewsService);
exports.ReviewsService = ReviewsService;
//# sourceMappingURL=reviews.service.js.map
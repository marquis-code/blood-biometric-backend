import { Injectable, BadRequestException, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Review, ReviewDocument } from './schemas/review.schema';
import { CreateReviewDto } from './dto/create-review.dto';
import { DoctorsService } from '../doctors/doctors.service';

@Injectable()
export class ReviewsService {
  constructor(
    @InjectModel(Review.name) private reviewModel: Model<ReviewDocument>,
    private doctorsService: DoctorsService,
  ) {}

  async create(patientId: string, createReviewDto: CreateReviewDto): Promise<Review> {
    // Check if review already exists for this appointment
    const existingReview = await this.reviewModel.findOne({
      appointmentId: createReviewDto.appointmentId,
      patientId,
    });

    if (existingReview) {
      throw new ConflictException('Review already exists for this appointment');
    }

    // Verify the appointment belongs to the patient and is completed
    const appointment = await this.verifyAppointment(
      createReviewDto.appointmentId,
      patientId,
      createReviewDto.doctorId,
    );

    if (appointment.status !== 'completed') {
      throw new BadRequestException('Can only review completed appointments');
    }

    const review = new this.reviewModel({
      patientId,
      ...createReviewDto,
    });

    const savedReview = await review.save();

    // Update doctor's average rating
    await this.doctorsService.updateRating(createReviewDto.doctorId, createReviewDto.rating);

    // Populate and return the review
    await savedReview.populate([
      { path: 'patientId', select: 'firstName lastName' },
      { path: 'doctorId', populate: { path: 'userId', select: 'firstName lastName' } }
    ]);

    return savedReview;
  }

  async findByDoctor(doctorId: string): Promise<Review[]> {
    return this.reviewModel
      .find({ doctorId, isVisible: true })
      .populate('patientId', 'firstName lastName')
      .sort({ createdAt: -1 })
      .exec();
  }

  async findByPatient(patientId: string): Promise<Review[]> {
    return this.reviewModel
      .find({ patientId })
      .populate({
        path: 'doctorId',
        populate: { path: 'userId', select: 'firstName lastName' }
      })
      .sort({ createdAt: -1 })
      .exec();
  }

  async findOne(id: string): Promise<Review> {
    const review = await this.reviewModel
      .findById(id)
      .populate('patientId', 'firstName lastName')
      .populate({
        path: 'doctorId',
        populate: { path: 'userId', select: 'firstName lastName' }
      })
      .exec();

    if (!review) {
      throw new NotFoundException('Review not found');
    }

    return review;
  }

  async addDoctorResponse(reviewId: string, doctorId: string, response: string): Promise<Review> {
    const review = await this.reviewModel.findById(reviewId);

    if (!review) {
      throw new NotFoundException('Review not found');
    }

    if (review.doctorId.toString() !== doctorId) {
      throw new BadRequestException('Unauthorized to respond to this review');
    }

    const updatedReview = await this.reviewModel
      .findByIdAndUpdate(
        reviewId,
        {
          doctorResponse: response,
          doctorResponseDate: new Date(),
        },
        { new: true }
      )
      .populate('patientId', 'firstName lastName')
      .exec();

    return updatedReview;
  }

  async hideReview(reviewId: string): Promise<void> {
    const result = await this.reviewModel.findByIdAndUpdate(
      reviewId,
      { isVisible: false },
      { new: true }
    );

    if (!result) {
      throw new NotFoundException('Review not found');
    }
  }

  async getDoctorRatingStats(doctorId: string): Promise<{
    averageRating: number;
    totalReviews: number;
    ratingDistribution: { [key: number]: number };
  }> {
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

  // Helper method to verify appointment (would integrate with AppointmentsService)
  private async verifyAppointment(appointmentId: string, patientId: string, doctorId: string): Promise<any> {
    // This would typically call the AppointmentsService to verify the appointment
    // For now, we'll return a mock object
    return {
      _id: appointmentId,
      patientId,
      doctorId,
      status: 'completed',
    };
  }
}
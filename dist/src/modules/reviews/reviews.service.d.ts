import { Model } from 'mongoose';
import { Review, ReviewDocument } from './schemas/review.schema';
import { CreateReviewDto } from './dto/create-review.dto';
import { DoctorsService } from '../doctors/doctors.service';
export declare class ReviewsService {
    private reviewModel;
    private doctorsService;
    constructor(reviewModel: Model<ReviewDocument>, doctorsService: DoctorsService);
    create(patientId: string, createReviewDto: CreateReviewDto): Promise<Review>;
    findByDoctor(doctorId: string): Promise<Review[]>;
    findByPatient(patientId: string): Promise<Review[]>;
    findOne(id: string): Promise<Review>;
    addDoctorResponse(reviewId: string, doctorId: string, response: string): Promise<Review>;
    hideReview(reviewId: string): Promise<void>;
    getDoctorRatingStats(doctorId: string): Promise<{
        averageRating: number;
        totalReviews: number;
        ratingDistribution: {
            [key: number]: number;
        };
    }>;
    private verifyAppointment;
}

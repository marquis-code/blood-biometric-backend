import { ReviewsService } from './reviews.service';
import { CreateReviewDto } from './dto/create-review.dto';
export declare class ReviewsController {
    private readonly reviewsService;
    constructor(reviewsService: ReviewsService);
    create(req: any, createReviewDto: CreateReviewDto): Promise<import("./schemas/review.schema").Review>;
    findByDoctor(doctorId: string): Promise<import("./schemas/review.schema").Review[]>;
    getDoctorRatingStats(doctorId: string): Promise<{
        averageRating: number;
        totalReviews: number;
        ratingDistribution: {
            [key: number]: number;
        };
    }>;
    getMyReviews(req: any): Promise<import("./schemas/review.schema").Review[]>;
    findOne(id: string): Promise<import("./schemas/review.schema").Review>;
    addDoctorResponse(id: string, req: any, body: {
        response: string;
    }): Promise<import("./schemas/review.schema").Review>;
    hideReview(id: string): Promise<void>;
}

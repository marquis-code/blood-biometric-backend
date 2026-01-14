import { Controller, Get, Post, Body, Param, Patch, Delete, UseGuards, Request } from '@nestjs/common';
import { ReviewsService } from './reviews.service';
import { CreateReviewDto } from './dto/create-review.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles, Role } from '../../common/decorators/roles.decorator';

@Controller('reviews')
@UseGuards(JwtAuthGuard, RolesGuard)
export class ReviewsController {
  constructor(private readonly reviewsService: ReviewsService) {}

  @Post()
  @Roles(Role.PATIENT)
  create(@Request() req, @Body() createReviewDto: CreateReviewDto) {
    return this.reviewsService.create(req.user.sub, createReviewDto);
  }

  @Get('doctor/:doctorId')
  findByDoctor(@Param('doctorId') doctorId: string) {
    return this.reviewsService.findByDoctor(doctorId);
  }

  @Get('doctor/:doctorId/stats')
  getDoctorRatingStats(@Param('doctorId') doctorId: string) {
    return this.reviewsService.getDoctorRatingStats(doctorId);
  }

  @Get('my-reviews')
  @Roles(Role.PATIENT)
  getMyReviews(@Request() req) {
    return this.reviewsService.findByPatient(req.user.sub);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.reviewsService.findOne(id);
  }

  @Patch(':id/respond')
  @Roles(Role.DOCTOR)
  addDoctorResponse(
    @Param('id') id: string,
    @Request() req,
    @Body() body: { response: string }
  ) {
    return this.reviewsService.addDoctorResponse(id, req.user.sub, body.response);
  }

  @Delete(':id')
  @Roles(Role.ADMIN)
  hideReview(@Param('id') id: string) {
    return this.reviewsService.hideReview(id);
  }
}
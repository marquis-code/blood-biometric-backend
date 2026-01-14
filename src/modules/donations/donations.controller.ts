import { Controller, Post, Get, Body } from '@nestjs/common';
import { DonationsService } from './donations.service';

@Controller('api/donations')
export class DonationsController {
  constructor(private readonly donationsService: DonationsService) {}

  @Post('record')
  async recordDonation(@Body() body: any) {
    return await this.donationsService.recordDonation(
      body.donorId,
      body.quantity,
      body.location,
      body.staffId,
      body.notes,
    );
  }

  @Get()
  async findAll() {
    return await this.donationsService.findAll();
  }
}
import { Controller, Post, Get, Body } from '@nestjs/common';
import { DonationsService } from './donations.service';
import { RecordDonationDto } from './dto/record-donation.dto';

@Controller('api/donations')
export class DonationsController {
  constructor(private readonly donationsService: DonationsService) {}

  @Post('record')
  async recordDonation(@Body() recordDonationDto: RecordDonationDto) {
    return await this.donationsService.recordDonation(
      recordDonationDto.donorId,
      recordDonationDto.quantity,
      recordDonationDto.location,
      recordDonationDto.staffId,
      recordDonationDto.notes,
    );
  }

  @Get()
  async findAll() {
    return await this.donationsService.findAll();
  }
}
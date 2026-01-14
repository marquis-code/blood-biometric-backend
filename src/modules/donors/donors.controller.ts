import { Controller, Post, Get, Param, Body } from '@nestjs/common';
import { DonorsService } from './donors.service';
import { CreateDonorDto } from './dto/create-donor.dto';

@Controller('api/donors')
export class DonorsController {
  constructor(private readonly donorsService: DonorsService) {}

  @Post('register')
  async register(@Body() createDonorDto: CreateDonorDto) {
    return await this.donorsService.register(createDonorDto);
  }

  @Get()
  async findAll() {
    return await this.donorsService.findAll();
  }

  @Get(':id')
  async findById(@Param('id') id: string) {
    return await this.donorsService.findById(id);
  }
}

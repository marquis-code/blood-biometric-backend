import { Controller, Post, Body } from '@nestjs/common';
import { StaffService } from './staff.service';
import { StaffLoginDto } from './dto/staff-login.dto';

@Controller('api/staff')
export class StaffController {
  constructor(private readonly staffService: StaffService) {}

  @Post('login')
  async login(@Body() staffLoginDto: StaffLoginDto) {
    return await this.staffService.login(staffLoginDto.email, staffLoginDto.password);
  }
}
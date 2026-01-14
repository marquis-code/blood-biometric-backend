import { Controller, Post, Body } from '@nestjs/common';
import { StaffService } from './staff.service';

@Controller('api/staff')
export class StaffController {
  constructor(private readonly staffService: StaffService) {}

  @Post('login')
  async login(@Body() body: { email: string; password: string }) {
    return await this.staffService.login(body.email, body.password);
  }
}
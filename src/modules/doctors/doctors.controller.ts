import { Controller, Post, Get, Put, Patch, Body, Param, Query, UseGuards, Req } from '@nestjs/common';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles, Role } from '../../common/decorators/roles.decorator';
import { DoctorsService } from './doctors.service';
import { CreateDoctorProfileDto, ConsultationFeeDto } from './dto/create-doctor-profile.dto';
import { UpdateDoctorProfileDto } from './dto/update-doctor-profile.dto';
import { UpdateAvailabilityDto } from './dto/update-availability.dto';

@Controller('doctors')
@UseGuards(JwtAuthGuard)
export class DoctorsController {
  constructor(private readonly doctorsService: DoctorsService) {}

  @Post('profile')
 @Roles(Role.DOCTOR)
  @UseGuards(RolesGuard)
  async createProfile(@Req() req, @Body() createDoctorProfileDto: CreateDoctorProfileDto) {
    return this.doctorsService.createProfile(req.user.sub, createDoctorProfileDto);
  }

  @Put('profile')
  @Roles(Role.DOCTOR)
  @UseGuards(RolesGuard)
  async updateProfile(@Req() req, @Body() updateDoctorProfileDto: UpdateDoctorProfileDto) {
    return this.doctorsService.updateProfile(req.user.sub, updateDoctorProfileDto);
  }

  // ✅ NEW: Update consultation fees
  @Put('consultation-fees')
  @Roles(Role.DOCTOR)
  @UseGuards(RolesGuard)
  async updateConsultationFees(
    @Req() req,
    @Body() body: { consultationFees: ConsultationFeeDto[] }
  ) {
    return this.doctorsService.updateConsultationFees(req.user.sub, body.consultationFees);
  }

  // ✅ NEW: Get consultation fee for specific type
  @Get('consultation-fee/:type')
  @Roles(Role.DOCTOR)
  @UseGuards(RolesGuard)
  async getConsultationFee(@Req() req, @Param('type') consultationType: string) {
    return this.doctorsService.getConsultationFee(req.user.sub, consultationType);
  }

  // ✅ NEW: Get all active consultation types
  @Get('consultation-types')
  @Roles(Role.DOCTOR)
  @UseGuards(RolesGuard)
  async getActiveConsultationTypes(@Req() req) {
    return this.doctorsService.getActiveConsultationTypes(req.user.sub);
  }

  // ✅ NEW: Toggle consultation type availability
  @Patch('consultation-type/:type/toggle')
  @Roles(Role.DOCTOR)
  @UseGuards(RolesGuard)
  async toggleConsultationType(
    @Req() req,
    @Param('type') consultationType: string,
    @Body() body: { isActive: boolean }
  ) {
    return this.doctorsService.toggleConsultationType(req.user.sub, consultationType, body.isActive);
  }

  // ✅ NEW: Get consultation fees by currency
  @Get('consultation-fees')
  @Roles(Role.DOCTOR)
  @UseGuards(RolesGuard)
  async getConsultationFeesByCurrency(
    @Req() req,
    @Query('currency') currency: string = 'NGN'
  ) {
    return this.doctorsService.getConsultationFeesByCurrency(req.user.sub, currency);
  }

  // ✅ PUBLIC: Get doctor details for booking (including consultation fees)
  @Get(':id/booking-info')
  async getDoctorForBooking(@Param('id') doctorId: string) {
    return this.doctorsService.getDoctorForBooking(doctorId);
  }

  @Get()
  async findAll(
    @Query('specialty') specialty?: string,
    @Query('language') language?: string,
    @Query('minRating') minRating?: number
  ) {
    const filters = { specialty, language, minRating };
    return this.doctorsService.findAll(filters);
  }

  @Get('profile')
  @Roles(Role.DOCTOR)
  @UseGuards(RolesGuard)
  async getMyProfile(@Req() req) {
    return this.doctorsService.findByUserId(req.user.sub);
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.doctorsService.findOne(id);
  }

  @Put('availability')
  @Roles(Role.DOCTOR)
  @UseGuards(RolesGuard)
  async updateAvailability(@Req() req, @Body() updateAvailabilityDto: UpdateAvailabilityDto) {
    return this.doctorsService.updateAvailability(req.user.sub, updateAvailabilityDto);
  }

  @Get(':id/available-slots')
  async getAvailableSlots(@Param('id') doctorId: string, @Query('date') date: string) {
    return this.doctorsService.getAvailableSlots(doctorId, date);
  }

  // Admin only routes
  @Post(':id/verify')
  @Roles(Role.ADMIN)
  @UseGuards(RolesGuard)
  async verifyDoctor(
    @Param('id') id: string,
    @Body() body: { status: 'approved' | 'rejected'; rejectionReason?: string }
  ) {
    return this.doctorsService.verifyDoctor(id, body.status, body.rejectionReason);
  }

  @Patch(':id/deactivate')
 @Roles(Role.ADMIN)
  @UseGuards(RolesGuard)
  async deactivateDoctor(@Param('id') id: string) {
    return this.doctorsService.deactivateDoctor(id);
  }
}
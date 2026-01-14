import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Request, Query } from '@nestjs/common';
import { AppointmentsService } from './appointments.service';
import { CreateAppointmentDto } from './dto/create-appointment.dto';
import { UpdateAppointmentDto } from './dto/update-appointment.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles, Role } from '../../common/decorators/roles.decorator';

@Controller('appointments')
@UseGuards(JwtAuthGuard, RolesGuard)
export class AppointmentsController {
  constructor(private readonly appointmentsService: AppointmentsService) {}

  @Post()
  @Roles(Role.PATIENT)
  create(@Request() req, @Body() createAppointmentDto: CreateAppointmentDto) {
    return this.appointmentsService.create(req.user.sub, createAppointmentDto);
  }

  @Get()
  @Roles(Role.ADMIN)
  findAll() {
    return this.appointmentsService.findAll();
  }

  @Get('my-appointments')
  getMyAppointments(@Request() req) {
    if (req.user.role === 'patient') {
      return this.appointmentsService.findByPatient(req.user.sub);
    } else if (req.user.role === 'doctor') {
      return this.appointmentsService.findByDoctor(req.user.sub);
    }
  }

  @Get('upcoming')
  getUpcomingAppointments(@Request() req) {
    return this.appointmentsService.getUpcomingAppointments(req.user.sub, req.user.role);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.appointmentsService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateAppointmentDto: UpdateAppointmentDto) {
    return this.appointmentsService.update(id, updateAppointmentDto);
  }

  @Post(':id/cancel')
  cancel(
    @Param('id') id: string,
    @Request() req,
    @Body() body: { cancellationReason?: string }
  ) {
    return this.appointmentsService.cancel(
      id,
      req.user.role,
      body.cancellationReason
    );
  }

  @Post(':id/complete')
  @Roles(Role.DOCTOR)
  complete(
    @Param('id') id: string,
    @Body() body: { notes?: string; prescription?: string }
  ) {
    return this.appointmentsService.completeAppointment(
      id,
      body.notes,
      body.prescription
    );
  }

  @Post(':id/generate-meeting-link')
  generateMeetingLink(@Param('id') id: string) {
    return this.appointmentsService.generateMeetingLink(id);
  }
}
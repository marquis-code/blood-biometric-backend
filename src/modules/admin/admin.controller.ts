import { Controller, Get, UseGuards, Query, Param } from '@nestjs/common';
import { AdminService } from './admin.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles, Role } from '../../common/decorators/roles.decorator';

@Controller('admin')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.ADMIN)
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Get('dashboard/stats')
  getDashboardStats() {
    return this.adminService.getDashboardStats();
  }

  @Get('doctors/pending-verifications')
  getPendingDoctorVerifications() {
    return this.adminService.getPendingDoctorVerifications();
  }

  @Get('transactions/recent')
  getRecentTransactions(@Query('limit') limit?: string) {
    return this.adminService.getRecentTransactions(limit ? parseInt(limit) : 50);
  }

  @Get('appointments/recent')
  getRecentAppointments(@Query('limit') limit?: string) {
    return this.adminService.getRecentAppointments(limit ? parseInt(limit) : 50);
  }

  @Get('analytics/user-growth')
  getUserGrowthData() {
    return this.adminService.getUserGrowthData();
  }

  @Get('analytics/revenue-growth')
  getRevenueGrowthData() {
    return this.adminService.getRevenueGrowthData();
  }

  @Get('doctors/top')
  getTopDoctors(@Query('limit') limit?: string) {
    return this.adminService.getTopDoctors(limit ? parseInt(limit) : 10);
  }

  @Get('system/health')
  getSystemHealth() {
    return this.adminService.getSystemHealth();
  }

  @Get('export/:type')
  exportData(
    @Param('type') type: 'users' | 'appointments' | 'transactions',
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
  ) {
    const start = startDate ? new Date(startDate) : undefined;
    const end = endDate ? new Date(endDate) : undefined;
    return this.adminService.exportData(type, start, end);
  }
}
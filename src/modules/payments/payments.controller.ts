import { Controller, Post, Body, Get, Param, UseGuards, Request, Headers, RawBodyRequest, Req } from '@nestjs/common';
import { PaymentsService } from './payments.service';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles, Role } from '../../common/decorators/roles.decorator';

@Controller('payments')
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}

  @Post('create-payment-intent')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.PATIENT)
  createPaymentIntent(@Request() req, @Body() createPaymentDto: CreatePaymentDto) {
    return this.paymentsService.createPaymentIntent(req.user.sub, createPaymentDto);
  }

  @Post('confirm/:transactionId')
  @UseGuards(JwtAuthGuard)
  confirmPayment(@Param('transactionId') transactionId: string) {
    return this.paymentsService.confirmPayment(transactionId);
  }

  @Post('webhook')
  async handleWebhook(
    @Headers('stripe-signature') signature: string,
    @Req() req: RawBodyRequest<Request>,
  ) {
    await this.paymentsService.handleWebhook(signature, req.rawBody);
    return { received: true };
  }

  @Get('earnings')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.DOCTOR)
  getDoctorEarnings(@Request() req) {
    return this.paymentsService.getDoctorEarnings(req.user.sub);
  }

  @Post('payout')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.DOCTOR)
  processPayout(@Request() req) {
    return this.paymentsService.processDoctorPayout(req.user.sub);
  }

  @Get('history')
  @UseGuards(JwtAuthGuard)
  getTransactionHistory(@Request() req) {
    return this.paymentsService.getTransactionHistory(req.user.sub, req.user.role);
  }

  @Get('platform-revenue')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  getPlatformRevenue() {
    return this.paymentsService.getPlatformRevenue();
  }
}
import { IsOptional, IsString, IsEnum, IsBoolean, IsNumber } from 'class-validator';

export class UpdateAppointmentDto {
  @IsOptional()
  @IsEnum(['scheduled', 'confirmed', 'in-progress', 'completed', 'cancelled', 'no-show'])
  status?: string;

  @IsOptional()
  @IsString()
  notes?: string;

  @IsOptional()
  @IsString()
  prescription?: string;

  @IsOptional()
  @IsString()
  meetingLink?: string;

  @IsOptional()
  @IsString()
  chatRoomId?: string;

  @IsOptional()
  @IsString()
  cancelledBy?: string;

  @IsOptional()
  @IsString()
  cancellationReason?: string;

  // ✅ Add the missing fields used in the service
  @IsOptional()
  @IsBoolean()
  refundIssued?: boolean;

  @IsOptional()
  @IsNumber()
  refundAmount?: number;

  @IsOptional()
  @IsBoolean()
  isPaid?: boolean;

  @IsOptional()
  @IsString()
  paymentId?: string;
}

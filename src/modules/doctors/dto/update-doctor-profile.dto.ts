import { PartialType } from '@nestjs/mapped-types';
import { CreateDoctorProfileDto, ConsultationFeeDto, BankDetailsDto, DailyAvailabilityDto } from './create-doctor-profile.dto';
import { IsOptional, IsArray, ValidateNested, IsString, IsEnum, IsBoolean } from 'class-validator';
import { Type } from 'class-transformer';

export class UpdateDoctorProfileDto extends PartialType(CreateDoctorProfileDto) {
  // ✅ Allow updating specific consultation fees
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ConsultationFeeDto)
  consultationFees?: ConsultationFeeDto[];

  @IsOptional()
  @IsString()
  bio?: string;

  @IsOptional()
  @IsBoolean()
  isAvailable?: boolean;

  @IsOptional()
  @IsString()
  @IsEnum(['pending', 'approved', 'rejected'])
  verificationStatus?: string;

  @IsOptional()
  @IsString()
  rejectionReason?: string;

  @IsOptional()
  @IsString()
  stripeConnectId?: string;
}
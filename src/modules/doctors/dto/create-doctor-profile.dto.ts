
import { IsNotEmpty, IsString, IsArray, IsNumber, IsOptional, IsEnum, ValidateNested, IsBoolean } from 'class-validator';
import { Type } from 'class-transformer';

// ✅ DTO for consultation fee structure
export class ConsultationFeeDto {
  @IsNotEmpty()
  @IsString()
  @IsEnum(['video', 'audio', 'chat', 'in-person'])
  type: string;

  @IsNotEmpty()
  @IsNumber()
  amount: number;

  @IsOptional()
  @IsString()
  @IsEnum(['NGN', 'USD', 'EUR', 'GBP'])
  currency?: string = 'NGN'; // Default to NGN

  @IsOptional()
  @IsBoolean()
  isActive?: boolean = true;
}

// ✅ DTO for bank details
export class BankDetailsDto {
  @IsNotEmpty()
  @IsString()
  accountName: string;

  @IsNotEmpty()
  @IsString()
  accountNumber: string;

  @IsNotEmpty()
  @IsString()
  bankName: string;

  @IsNotEmpty()
  @IsString()
  routingNumber: string;
}

// ✅ DTO for availability slots
export class AvailabilitySlotDto {
  @IsNotEmpty()
  @IsString()
  startTime: string;

  @IsNotEmpty()
  @IsString()
  endTime: string;

  @IsOptional()
  @IsBoolean()
  isAvailable?: boolean = true;
}

// ✅ DTO for daily availability
export class DailyAvailabilityDto {
  @IsNotEmpty()
  @IsString()
  @IsEnum(['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'])
  day: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => AvailabilitySlotDto)
  slots: AvailabilitySlotDto[];
}

export class CreateDoctorProfileDto {
  @IsNotEmpty()
  @IsString()
  licenseNumber: string;

  @IsOptional()
  @IsString()
  licenseDocument?: string;

  @IsArray()
  @IsString({ each: true })
  specialties: string[];

  @IsNotEmpty()
  @IsString()
  qualifications: string;

  @IsNumber()
  experience: number;

  @IsArray()
  @IsString({ each: true })
  languages: string[];

  // ✅ Replace single consultationFee with array of fees by consultation type
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ConsultationFeeDto)
  consultationFees: ConsultationFeeDto[];

  @IsOptional()
  @IsString()
  about?: string;

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => DailyAvailabilityDto)
  availability?: DailyAvailabilityDto[];

  @IsOptional()
  @ValidateNested()
  @Type(() => BankDetailsDto)
  bankDetails?: BankDetailsDto;
}
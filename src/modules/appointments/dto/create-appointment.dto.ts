import { IsNotEmpty, IsString, IsEnum, IsDateString, IsOptional, IsNumber } from 'class-validator';

export class CreateAppointmentDto {
  @IsNotEmpty()
  @IsString()
  doctorId: string;

  @IsNotEmpty()
  @IsDateString()
  appointmentDate: Date;

  @IsNotEmpty()
  @IsString()
  startTime: string;

  @IsNotEmpty()
  @IsString()
  endTime: string;

  @IsNotEmpty()
  @IsEnum(['video', 'voice', 'chat'])
  consultationType: string;

  @IsOptional()
  @IsString()
  reason?: string;

  @IsNotEmpty()
  @IsNumber()
  consultationFee: number;
}
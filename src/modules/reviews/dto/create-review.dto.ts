import { IsNotEmpty, IsString, IsNumber, Min, Max, IsOptional } from 'class-validator';

export class CreateReviewDto {
  @IsNotEmpty()
  @IsString()
  doctorId: string;

  @IsNotEmpty()
  @IsString()
  appointmentId: string;

  @IsNotEmpty()
  @IsNumber()
  @Min(1)
  @Max(5)
  rating: number;

  @IsOptional()
  @IsString()
  comment?: string;
}
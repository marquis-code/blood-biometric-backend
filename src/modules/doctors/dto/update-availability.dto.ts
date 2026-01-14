import { IsArray, IsOptional, IsDateString } from 'class-validator';

export class UpdateAvailabilityDto {
  @IsOptional()
  @IsArray()
  availability?: Array<{
    day: string;
    slots: Array<{
      startTime: string;
      endTime: string;
      isAvailable?: boolean;
    }>;
  }>;

  @IsOptional()
  @IsArray()
  @IsDateString({}, { each: true })
  blackoutDates?: Date[];
}
import { IsString, IsOptional, IsMongoId } from 'class-validator';

export class RecordDonationDto {
  @IsMongoId()
  donorId: string;

  @IsString()
  quantity: string;

  @IsString()
  location: string;

  @IsMongoId()
  staffId: string;

  @IsString()
  @IsOptional()
  notes?: string;
}
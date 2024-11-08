import { IsEnum, IsOptional, IsString, IsArray } from 'class-validator';
import { LeadStatusEnum } from 'src/enums/leads-status.enum';

export class UpdateLeadStatusDto {
  @IsEnum(LeadStatusEnum)
  status: LeadStatusEnum;

  @IsOptional()
  @IsString()
  notes?: string; // Optional notes when updating the status

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  surveyImages?: string[]; // Array of image paths for completed surveys
}

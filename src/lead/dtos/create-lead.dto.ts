import { IsString, IsOptional, IsEmail } from 'class-validator';

export class CreateLeadDto {
  @IsString()
  customerName: string;

  @IsEmail()
  email: string;

  @IsOptional()
  @IsString()
  notes?: string; // Optional field for initial notes
}

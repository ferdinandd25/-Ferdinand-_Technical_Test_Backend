import { IsString } from 'class-validator';

export class updateLeadAssigneeDto {
  @IsString()
  salespersonId: string;
}

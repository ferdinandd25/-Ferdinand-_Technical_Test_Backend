import { IsDate } from 'class-validator';

export class SuspendSalespersonDto {
  @IsDate()
  startDate: Date;

  @IsDate()
  endDate: Date;
}

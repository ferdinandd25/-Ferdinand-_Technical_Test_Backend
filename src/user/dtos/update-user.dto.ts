import {
  IsString,
  IsEmail,
  MinLength,
  IsArray,
  IsBoolean,
  IsEnum,
  IsOptional,
} from 'class-validator';
import { UserRoleEnum } from 'src/enums/user-role.enum';

export class UpdateUserDto {
  @IsEmail()
  email: string;

  @IsString()
  full_name: string;

  @IsEnum(UserRoleEnum)
  role: UserRoleEnum;

  @IsString()
  @MinLength(6)
  password: string;

  @IsOptional()
  @IsBoolean()
  status: boolean;

  @IsArray()
  salesTypes: string[];
}

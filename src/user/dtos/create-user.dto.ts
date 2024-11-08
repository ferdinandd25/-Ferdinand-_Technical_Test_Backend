import {
  IsString,
  IsEmail,
  MinLength,
  IsEnum,
  IsBoolean,
  IsArray,
  IsOptional,
} from 'class-validator';
import { UserRoleEnum } from 'src/enums/user-role.enum';

export class CreateUserDto {
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

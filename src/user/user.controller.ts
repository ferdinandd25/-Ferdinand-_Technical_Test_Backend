import {
  Controller,
  Post,
  Put,
  Body,
  Param,
  UseGuards,
  HttpStatus,
  Req,
  Res,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dtos/create-user.dto';
import { UpdateUserDto } from './dtos/update-user.dto';
import { SignInUserDto } from './dtos/sign-in-user.dto';
import { AuthGuard } from 'src/auth/auth.guard';
import { UserRoleEnum } from 'src/enums/user-role.enum';
import { SuspendSalespersonDto } from './dtos/suspend-salesperson.dto';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  @UseGuards(AuthGuard)
  async createUser(
    @Req() req,
    @Body() createUserDto: CreateUserDto,
    @Res() res,
  ) {
    const allowedRoles = [UserRoleEnum.SUPERADMIN];
    if (allowedRoles.indexOf(req.user?.role) === -1) {
      return res.status(HttpStatus.OK).json({
        status: 'failed',
        message: 'Akun Anda tidak diijinkan untuk membuat Leads.',
      });
    }
    return res
      .status(HttpStatus.OK)
      .json(this.userService.createUser(createUserDto));
  }

  @Put(':id')
  async updateUser(
    @Req() req,
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto,
    @Res() res,
  ) {
    const allowedRoles = [UserRoleEnum.SUPERADMIN];
    if (allowedRoles.indexOf(req.user?.role) === -1 || req.user?._id !== id) {
      return res.status(HttpStatus.OK).json({
        status: 'failed',
        message: 'Akun Anda tidak diijinkan untuk membuat Leads.',
      });
    }
    return res
      .status(HttpStatus.OK)
      .json(this.userService.updateUser(id, updateUserDto));
  }

  @Post(':id/suspend')
  async suspend(
    @Req() req,
    @Param('id') id: string,
    @Body() suspendDto: SuspendSalespersonDto,
    @Res() res,
  ) {
    const allowedRoles = [UserRoleEnum.SUPERADMIN];
    if (allowedRoles.indexOf(req.user?.role) === -1) {
      return res.status(HttpStatus.OK).json({
        status: 'failed',
        message: 'Akun Anda tidak diijinkan untuk membuat Leads.',
      });
    }
    return res
      .status(HttpStatus.OK)
      .json(this.userService.suspendUser(id, suspendDto));
  }

  @Post('sign-in')
  async signIn(@Body() signInUserDto: SignInUserDto, @Res() res) {
    return res
      .status(HttpStatus.OK)
      .json(await this.userService.signIn(signInUserDto));
  }
}

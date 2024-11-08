import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dtos/create-user.dto';
import { UpdateUserDto } from './dtos/update-user.dto';
import { SignInUserDto } from './dtos/sign-in-user.dto';
import * as bcrypt from 'bcryptjs';
import { InjectModel } from '@nestjs/mongoose';
import { User } from 'src/schemas/user.schema';
import mongoose, { Model, Types } from 'mongoose';
import { ReadUserDto } from './dtos/read-user.dto';
import { AuthService } from 'src/auth/auth.service';
import { SuspendSalespersonDto } from './dtos/suspend-salesperson.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name)
    private readonly userModel: Model<User & ReadUserDto>,
    private readonly authService: AuthService,
  ) {}

  async createUser(
    createUserDto: CreateUserDto,
    dbSession: mongoose.Connection = null,
  ) {
    const { email, full_name, role, password, status, salesTypes } =
      createUserDto;
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await this.userModel.create(
      {
        email,
        full_name,
        role,
        status,
        password: hashedPassword,
        salesTypes,
      },
      { session: dbSession },
    );
    return newUser;
  }

  async updateUser(id: string, updateUserDto: UpdateUserDto) {
    const user = await this.userModel.findById(id);

    if (!user) {
      throw new NotFoundException('User not found');
    }

    const { email, full_name, role, password, status, salesTypes } =
      updateUserDto;
    if (email) user.email = email;
    if (full_name) user.full_name = full_name;
    if (role) user.role = role;
    if (password) user.password = await bcrypt.hash(password, 10);
    if (status) user.status = status;
    if (salesTypes) user.salesTypes = salesTypes;
    await user.save();
    return { status: 'success', data: user };
  }

  async signIn(signInUserDto: SignInUserDto) {
    const result = await this.authService.signIn(
      signInUserDto.email,
      signInUserDto.password,
    );

    return result;
  }

  async suspendUser(id: string, suspendDto: SuspendSalespersonDto) {
    const user = await this.userModel.findOne({
      _id: new Types.ObjectId(id),
    });

    if (!user) {
      return { status: 'failed', message: 'User tidak ditemukan' };
    }

    // TODO: set rabbitmq to run at specific date to make user.status to false on startDate
    const { startDate, endDate } = suspendDto;
    user.suspension = {
      startDate,
      endDate,
    };
    await user.save();
  }
}

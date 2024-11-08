import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from 'src/schemas/user.schema';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name)
    private userModel: Model<User>,
    private jwtService: JwtService,
  ) {}

  async signIn(email: string, pass: string): Promise<any> {
    const user = await this.userModel.findOne({ email, status: true });
    if (!user) {
      throw new UnauthorizedException('Email tidak ditemukan / tidak aktif');
    }
    const { password, ...userData } = user.toObject();
    const validPassword = await bcrypt.compare(pass, password);
    console.log({ email, pass, password, validPassword });
    if (!validPassword) {
      throw new UnauthorizedException('Email atau password salah.');
    }
    const payload = {
      ...userData,
    };
    return {
      status: 'success',
      data: {
        ...userData,
        access_token: await this.jwtService.signAsync(payload),
      },
    };
  }
}

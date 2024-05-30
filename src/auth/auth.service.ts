import { BadRequestException, Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { IUser } from 'src/interfaces/user.interface';
import { ConfigService } from '@nestjs/config';
import { Response } from 'express';
import ms from 'ms';
import { IPayload } from 'src/interfaces/payload.interface';
import { AuthRegisterDto } from './dto/auth-register.dto';
import { ChangePasswordDto } from 'src/users/dto/change-password.dto';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  async validateUser(username: string, pass: string) {
    const user = await this.usersService.findByEmail(username);

    if (user) {
      const { password } = user;
      const isValidPassword = await this.usersService.isValidPassword(pass, password);

      if (isValidPassword) {
        return user;
      }
    }

    return null;
  }

  async login(user: IUser, response: Response) {
    const payload: IPayload = {
      email: user.email,
      sub: user.id,
      name: user.name,
      role: user.role,
    };

    const refreshToken = await this.createRefreshToken(payload);

    response.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      maxAge: ms(this.configService.get<string>('JWT_REFRESH_EXPIRES')),
    });

    await this.usersService.updateRefreshToken(refreshToken, user.id);

    return {
      accessToken: await this.jwtService.signAsync({
        ...payload,
      }),
    };
  }

  refreshToken = async (refreshToken: string) => {
    try {
      await this.jwtService.verifyAsync(refreshToken, {
        secret: this.configService.get<string>('JWT_REFRESH_TOKEN_SECRET'),
      });

      const user = await this.usersService.findByRefreshToken(refreshToken);

      if (!user) {
        throw new BadRequestException('User not found');
      }

      const payload: IPayload = {
        email: user.email,
        sub: user._id,
        name: user.name,
        role: user.role,
      };

      return {
        accessToken: await this.jwtService.signAsync({
          ...payload,
        }),
      };
    } catch (error) {
      throw new BadRequestException('Invalid refresh token');
    }
  };

  createRefreshToken = async (payload: IPayload) => {
    return await this.jwtService.signAsync(payload, {
      secret: this.configService.get<string>('JWT_REFRESH_TOKEN_SECRET'),
      expiresIn: this.configService.get<string>('JWT_REFRESH_EXPIRES'),
    });
  };

  register = async (authRegisterDto: AuthRegisterDto) => {
    return await this.usersService.register(authRegisterDto);
  };

  changePassword = async (changePasswordDto: ChangePasswordDto) => {
    return this.usersService.changePassword(changePasswordDto);
  };
}

import { BadRequestException, Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { IUser } from 'src/interfaces/user.interface';
import { ConfigService } from '@nestjs/config';
import { Response } from 'express';
import ms from 'ms';
import { IPayload } from 'src/interfaces/payload.interface';
import { AuthRegisterDto } from './dto/auth-register.dto';
import { MailService } from 'src/mail/mail.service';
import { ChangePasswordDto } from 'src/users/dto/change-password.dto';
import { OtpsService } from 'src/otps/otps.service';
import { AuthOtpCodeDto } from './dto/auth-otp-code.dto';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private configService: ConfigService,
    private mailService: MailService,
    private otpsService: OtpsService,
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
    const [user] = await Promise.all([
      this.usersService.register(authRegisterDto),
      this.otpsService.create({ email: authRegisterDto.username }),
    ]);

    return user;
  };

  sendOtpCode = async (email: string) => {
    const [user, otp] = await Promise.all([this.usersService.findByEmail(email), this.otpsService.findByEmail(email)]);

    if (!user) {
      throw new BadRequestException('Email invalid');
    }

    if (!otp) {
      this.otpsService.create({ email });
    }

    const otpCode = Math.floor(100000 + Math.random() * 900000);
    const expiry = new Date(Date.now() + ms(this.configService.get<string>('OTP_CODE_EXPIRES')) / 1000);

    await this.otpsService.update(email, { otp: `${otpCode}`, expiry });
    return await this.mailService.sendOtpCode(otpCode, user.email);
  };

  verifyOtpCode = async (authOtpCodeDto: AuthOtpCodeDto) => {
    const { email } = authOtpCodeDto;
    const otp = await this.otpsService.findByEmail(email);

    if (otp.expiry < new Date(Date.now())) {
      throw new BadRequestException('OTP CODE expired');
    } else if (+otp.otp !== +authOtpCodeDto.otpCode) {
      throw new BadRequestException('OTP CODE invalid');
    }
  };

  changePassword = async (changePasswordDto: ChangePasswordDto) => {
    return this.usersService.changePassword(changePasswordDto);
  };
}

import { BadRequestException, Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from 'src/users/users.service';
import { ConfigService } from '@nestjs/config';
import { VerifyOtpCodeDto } from './dto/verify-otp-code-mail.dto';
import { OtpsService } from 'src/otps/otps.service';
import { VerifyEmail } from './dto/verify-mail.dto';

@Injectable()
export class MailService {
  constructor(
    private readonly mailerService: MailerService,
    private jwtService: JwtService,
    private usersService: UsersService,
    private configService: ConfigService,
    private otpsService: OtpsService,
  ) {}

  async sendMail(email: string) {
    return await this.mailerService
      .sendMail({
        to: email,
        from: '"DTL Shop" <dtlshop2004@gmail.com>',
        subject: 'Testing Nest MailerModule ✔',
        template: 'forgotPassword',
        context: {
          // Data to be sent to template engine.
          code: 'cf1a3f828287',
          username: 'john doe',
        },
      })
      .then(() => {
        console.log('Email has been sent');
      })
      .catch(() => {
        throw new BadRequestException('Send mail failed');
      });
  }

  sendOtpCode = async (sendOtpCodeDto: VerifyEmail) => {
    const otpCode = Math.floor(100000 + Math.random() * 900000);
    const { email } = sendOtpCodeDto;
    return await this.mailerService
      .sendMail({
        to: email,
        from: '"DTL Shop" <dtlshop2004@gmail.com>',
        subject: 'Testing Nest MailerModule ✔',
        template: 'forgotPassword',
        context: {
          otpCode,
        },
      })
      .then(async () => {
        await this.otpsService.create({ email, otp: otpCode });

        return true;
      })
      .catch(() => {
        throw new BadRequestException('Send OTP code failed');
      });
  };

  verifyOtpCode = async (verifyOtpCodeDto: VerifyOtpCodeDto) => {
    const { otpCode, email } = verifyOtpCodeDto;

    const record = await this.otpsService.findOne(email, otpCode);

    if (!record) throw new BadRequestException('Invalid OTP');

    await this.otpsService.remove(email, otpCode);
    return true;
  };

  sendVerificationEmail = async (email: string) => {
    const token = await this.jwtService.signAsync(
      { email },
      {
        secret: this.configService.get<string>('JWT_VERIFY_SECRET'),
        expiresIn: this.configService.get<string>('JWT_VERIFY_EXPIRES'),
      },
    );

    return await this.mailerService
      .sendMail({
        to: email,
        from: '"DTL Shop" <dtlshop2004@gmail.com>',
        subject: 'Testing Nest MailerModule ✔',
        template: 'veryfiEmail',
        context: {
          token,
        },
      })
      .then(() => {
        return { token };
      })
      .catch(() => {
        throw new BadRequestException('Email does not exist');
      });
  };

  verificationEmail = async (token: string) => {
    try {
      return await this.jwtService.verifyAsync(token, {
        secret: this.configService.get<string>('JWT_VERIFY_SECRET'),
      });
    } catch (error) {
      throw new BadRequestException('Verification email failed');
    }
  };
}

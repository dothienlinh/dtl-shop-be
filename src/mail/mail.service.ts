import { BadRequestException, Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from 'src/users/users.service';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class MailService {
  constructor(
    private readonly mailerService: MailerService,
    private jwtService: JwtService,
    private usersService: UsersService,
    private configService: ConfigService,
  ) {}

  async sendMail() {
    await this.mailerService
      .sendMail({
        to: 'dothienlinh2004thd@gmail.com',
        from: '"DTL Shop" <dtlshop2004@gmail.com>',
        subject: 'Testing Nest MailerModule ✔',
        template: 'forgotPassword',
        context: {
          // Data to be sent to template engine.
          code: 'cf1a3f828287',
          username: 'john doe',
        },
      })
      .then(() => {})
      .catch(() => {});
  }

  sendOtpCode = async (otpCode: number, email: string) => {
    await this.mailerService
      .sendMail({
        to: email,
        from: '"DTL Shop" <dtlshop2004@gmail.com>',
        subject: 'Testing Nest MailerModule ✔',
        template: 'forgotPassword',
        context: {
          otpCode,
        },
      })
      .then(() => {})
      .catch(() => {
        throw new BadRequestException('Send OTP code failed');
      });
  };

  sendVerificationEmail = async (email: string) => {
    const token = await this.jwtService.signAsync(
      { email },
      {
        secret: this.configService.get<string>('JWT_VERIFY_SECRET'),
        expiresIn: this.configService.get<string>('JWT_VERIFY_EXPIRES'),
      },
    );

    await this.mailerService.sendMail({
      to: email,
      from: '"DTL Shop" <dtlshop2004@gmail.com>',
      subject: 'Testing Nest MailerModule ✔',
      template: 'veryfiEmail',
      context: {
        token,
      },
    });

    return { token };
  };

  verificationEmail = async (token: string) => {
    try {
      const infoToken = await this.jwtService.verifyAsync(token, {
        secret: 'secret_veryli_email',
      });

      await this.usersService.verifyEmail(infoToken.email);

      return { message: 'success' };
    } catch (error) {
      throw new BadRequestException('Verification email failed');
    }
  };
}

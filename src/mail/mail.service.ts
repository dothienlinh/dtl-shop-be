import { MailerService } from '@nestjs-modules/mailer';
import { BadRequestException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { OtpsService } from 'src/otps/otps.service';
import { TokenVerifyService } from 'src/token-verify/token-verify.service';
import { UsersService } from 'src/users/users.service';
import { VerifyEmail } from './dto/verify-mail.dto';
import { VerifyOtpCodeDto } from './dto/verify-otp-code-mail.dto';

@Injectable()
export class MailService {
  constructor(
    private readonly mailerService: MailerService,
    private jwtService: JwtService,
    private configService: ConfigService,
    private otpsService: OtpsService,
    private usersService: UsersService,
    private tokenVerifyService: TokenVerifyService,
  ) {}

  sendOtpCode = async (sendOtpCodeDto: VerifyEmail) => {
    const { email } = sendOtpCodeDto;

    const isExist = await this.usersService.checkUserIsExist(email);
    if (isExist) throw new BadRequestException('Account already exists!');

    const otpCode = Math.floor(100000 + Math.random() * 900000);

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
        return await this.otpsService.create({ email, otp: otpCode });
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
        template: 'verifyEmail',
        context: {
          token,
        },
      })
      .then(async () => {
        const tokenVerify = await this.tokenVerifyService.create({ token });

        return tokenVerify ? true : false;
      })
      .catch(() => {
        throw new BadRequestException('Email does not exist');
      });
  };

  verificationEmail = async (token: string) => {
    try {
      const data = await this.jwtService.verifyAsync(token, {
        secret: this.configService.get<string>('JWT_VERIFY_SECRET'),
      });

      const tokenVerify = await this.tokenVerifyService.findAndRemove(token);

      if (!tokenVerify) {
        throw new BadRequestException('Verification email failed');
      }

      return data.email;
    } catch (error) {
      throw new BadRequestException('Verification email failed');
    }
  };
}

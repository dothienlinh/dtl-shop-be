import { OmitType } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber } from 'class-validator';
import { VerifyEmail } from './verify-mail.dto';

export class VerifyOtpCodeDto extends OmitType(VerifyEmail, [] as const) {
  @IsNumber()
  @IsNotEmpty()
  otpCode: number;
}

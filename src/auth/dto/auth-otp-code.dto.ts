import { IsNotEmpty, IsNumber } from 'class-validator';

export class AuthOtpCodeDto {
  @IsNumber()
  @IsNotEmpty()
  otpCode: number;
}

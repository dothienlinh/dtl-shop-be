import { IsEmail, IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class AuthOtpCodeDto {
  @IsNumber()
  @IsNotEmpty()
  otpCode: number;

  @IsString()
  @IsEmail()
  email: string;
}

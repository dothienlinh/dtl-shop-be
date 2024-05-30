import { IsEmail, IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateOtpDto {
  @IsString()
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNumber()
  @IsNotEmpty()
  otp: number;
}

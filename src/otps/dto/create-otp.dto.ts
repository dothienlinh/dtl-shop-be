import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class CreateOtpDto {
  @IsString()
  @IsNotEmpty()
  @IsEmail()
  email: string;
}

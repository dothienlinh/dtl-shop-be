import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class VerifyEmail {
  @IsString()
  @IsEmail()
  @IsNotEmpty()
  email: string;
}

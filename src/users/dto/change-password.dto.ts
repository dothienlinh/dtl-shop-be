import { OmitType } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { AuthRegisterDto } from 'src/auth/dto/auth-register.dto';

export class ChangePasswordDto extends OmitType(AuthRegisterDto, [
  'username',
] as const) {
  @IsNumber()
  @IsNotEmpty()
  otpCode: number;

  @IsNotEmpty()
  @IsEmail()
  @IsString()
  email: string;
}

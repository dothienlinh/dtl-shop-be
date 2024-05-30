import { OmitType } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';
import { AuthRegisterDto } from 'src/auth/dto/auth-register.dto';

export class ChangePasswordDto extends OmitType(AuthRegisterDto, ['username'] as const) {
  @IsNotEmpty()
  @IsEmail()
  @IsString()
  email: string;
}

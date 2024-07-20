import { OmitType } from '@nestjs/swagger';
import { AuthRegisterDto } from 'src/auth/dto/auth-register.dto';

export class ChangePasswordDto extends OmitType(AuthRegisterDto, ['email'] as const) {}

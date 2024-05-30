import { OmitType } from '@nestjs/swagger';
import { CreateOtpDto } from './create-otp.dto';
import { IsDate, IsNotEmpty, IsString } from 'class-validator';
import { Type } from 'class-transformer';

export class UpdateOtpDto extends OmitType(CreateOtpDto, ['email'] as const) {
  @IsString()
  @IsNotEmpty()
  otp: string;

  @IsDate()
  @Type(() => Date)
  expiry: Date;
}

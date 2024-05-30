import { Controller, Post, Body, BadRequestException } from '@nestjs/common';
import { OtpsService } from './otps.service';
import { CreateOtpDto } from './dto/create-otp.dto';
import { ApiTags } from '@nestjs/swagger';
@ApiTags('otps')
@Controller('otps')
export class OtpsController {
  constructor(private readonly otpsService: OtpsService) {}

  @Post()
  async create(@Body() createOtpDto: CreateOtpDto) {
    const { email } = createOtpDto;
    const opt = await this.otpsService.findByEmail(email);

    if (!opt) {
      throw new BadRequestException('Email already exist');
    }

    return this.otpsService.create(createOtpDto);
  }
}

import { Controller, Get, Post, Body, Patch, Param, Delete, BadRequestException } from '@nestjs/common';
import { OtpsService } from './otps.service';
import { CreateOtpDto } from './dto/create-otp.dto';
import { UpdateOtpDto } from './dto/update-otp.dto';

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

  @Get()
  findAll() {
    return this.otpsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.otpsService.findOne(id);
  }

  @Patch(':id')
  update(@Body('email') email: string, @Body() updateOtpDto: UpdateOtpDto) {
    return this.otpsService.update(email, updateOtpDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.otpsService.remove(id);
  }
}

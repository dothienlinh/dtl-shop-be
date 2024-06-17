import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { MailService } from './mail.service';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { ResponseMessage } from 'src/decorators/responseMessage.decorator';
import { VerifyEmail } from './dto/verify-mail.dto';
import { Public } from 'src/decorators/public.decorators';
import { VerifyOtpCodeDto } from './dto/verify-otp-code-mail.dto';

@ApiTags('mail')
@Controller('mail')
export class MailController {
  constructor(private readonly mailService: MailService) {}

  @Public()
  @Post('/send-verification-email')
  @ApiOperation({
    summary: 'Send Verification Email',
  })
  @ResponseMessage('If the account exist, we will email you instructions to reset the password.')
  async verifyEmail(@Body() email: VerifyEmail) {
    return await this.mailService.sendVerificationEmail(email.email);
  }

  @Public()
  @Get('/verify-email')
  @ApiOperation({
    summary: 'Verify Mail',
  })
  async verifyMail(@Query('token') token: string) {
    return await this.mailService.verificationEmail(token);
  }

  @Public()
  @Post('/send-otp-code')
  @ApiOperation({
    summary: 'Send Otp Code',
  })
  @ResponseMessage('Sending OTP code successfully!')
  async sendOtpCode(@Body() sendOtpCodeDto: VerifyEmail) {
    return await this.mailService.sendOtpCode(sendOtpCodeDto);
  }

  @Public()
  @Post('/verify-otp-code')
  @ApiOperation({
    summary: 'Verify Otp Code',
  })
  @ResponseMessage('Verify OTP code successfully!')
  async verifyOtpCode(@Body() verifyOtpCodeDto: VerifyOtpCodeDto) {
    return this.mailService.verifyOtpCode(verifyOtpCodeDto);
  }
}

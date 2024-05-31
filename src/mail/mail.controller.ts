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

  @Post('')
  @ApiOperation({
    summary: 'Send Mail',
  })
  @ResponseMessage('send email successfully')
  sendMailer(@Body() email: VerifyEmail) {
    return this.mailService.sendMail(email.email);
  }

  @Public()
  @Post('/send-verification-email')
  @ApiOperation({
    summary: 'Send Verification Email',
  })
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
  async sendOtpCode(@Body() sendOtpCodeDto: VerifyEmail) {
    return await this.mailService.sendOtpCode(sendOtpCodeDto);
  }

  @Public()
  @Post('/verify-otp-code')
  @ApiOperation({
    summary: 'Verify Otp Code',
  })
  async verifyOtpCode(@Body() verifyOtpCodeDto: VerifyOtpCodeDto) {
    return this.mailService.verifyOtpCode(verifyOtpCodeDto);
  }
}

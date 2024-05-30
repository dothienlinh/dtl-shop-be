import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { MailService } from './mail.service';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { ResponseMessage } from 'src/decorators/responseMessage.decorator';
import { VerifyEmail } from './dto/verify-mail.dto';
import { Public } from 'src/decorators/public.decorators';

@ApiTags('mail')
@Controller('mail')
export class MailController {
  constructor(private readonly mailService: MailService) {}

  @Get()
  @ApiOperation({
    summary: 'Send Mail',
  })
  @ResponseMessage('send email successfully')
  sendMailer() {
    const mail = this.mailService.sendMail();

    return { mail };
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
}

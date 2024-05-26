import { Controller, Get } from '@nestjs/common';
import { MailService } from './mail.service';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { ResponseMessage } from 'src/decorators/responseMessage.decorator';

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
}

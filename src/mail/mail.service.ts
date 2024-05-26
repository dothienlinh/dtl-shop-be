import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';

@Injectable()
export class MailService {
  constructor(private readonly mailerService: MailerService) {}

  async sendMail() {
    await this.mailerService
      .sendMail({
        to: 'dothienlinh2004thd@gmail.com',
        from: '"DTL Shop" <dtlshop2004@gmail.com>',
        subject: 'Testing Nest MailerModule ✔',
        template: 'forgotPassword',
        context: {
          // Data to be sent to template engine.
          code: 'cf1a3f828287',
          username: 'john doe',
        },
      })
      .then(() => {})
      .catch(() => {});
  }
}

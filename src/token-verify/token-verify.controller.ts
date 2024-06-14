import { Controller, Post, Body, Param } from '@nestjs/common';
import { TokenVerifyService } from './token-verify.service';
import { CreateTokenVerifyDto } from './dto/create-token-verify.dto';

@Controller('token-verify')
export class TokenVerifyController {
  constructor(private readonly tokenVerifyService: TokenVerifyService) {}

  @Post()
  create(@Body() createTokenVerifyDto: CreateTokenVerifyDto) {
    return this.tokenVerifyService.create(createTokenVerifyDto);
  }

  @Post('/find-and-remove')
  findAndRemove(@Param('token') token: string) {
    return this.tokenVerifyService.findAndRemove(token);
  }
}

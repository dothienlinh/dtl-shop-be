import { Body, Controller, Param, Post } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { CreateTokenVerifyDto } from './dto/create-token-verify.dto';
import { TokenVerifyService } from './token-verify.service';

@ApiTags('token-verify')
@Controller('token-verify')
export class TokenVerifyController {
  constructor(private readonly tokenVerifyService: TokenVerifyService) {}

  @ApiOperation({
    summary: 'Create a new token verify',
  })
  @Post()
  create(@Body() createTokenVerifyDto: CreateTokenVerifyDto) {
    return this.tokenVerifyService.create(createTokenVerifyDto);
  }

  @ApiOperation({
    summary: 'Find and delete a token verify',
  })
  @Post('/find-and-remove')
  findAndRemove(@Param('token') token: string) {
    return this.tokenVerifyService.findAndRemove(token);
  }
}

import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { TokenVerify, TokenVerifySchema } from './schemas/token-verify.schema';
import { TokenVerifyController } from './token-verify.controller';
import { TokenVerifyService } from './token-verify.service';

@Module({
  imports: [MongooseModule.forFeature([{ name: TokenVerify.name, schema: TokenVerifySchema }])],
  controllers: [TokenVerifyController],
  providers: [TokenVerifyService],
  exports: [TokenVerifyService],
})
export class TokenVerifyModule {}

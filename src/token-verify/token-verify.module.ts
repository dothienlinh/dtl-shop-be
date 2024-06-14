import { Module } from '@nestjs/common';
import { TokenVerifyService } from './token-verify.service';
import { TokenVerifyController } from './token-verify.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { TokenVerify, TokenVerifySchema } from './schemas/token-verify.schema';

@Module({
  imports: [MongooseModule.forFeature([{ name: TokenVerify.name, schema: TokenVerifySchema }])],
  controllers: [TokenVerifyController],
  providers: [TokenVerifyService],
  exports: [TokenVerifyService],
})
export class TokenVerifyModule {}

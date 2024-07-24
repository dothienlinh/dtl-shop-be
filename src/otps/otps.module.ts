import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { OtpsController } from './otps.controller';
import { OtpsService } from './otps.service';
import { Otp, OtpSchema } from './schemas/otp.schema';

@Module({
  imports: [MongooseModule.forFeature([{ name: Otp.name, schema: OtpSchema }])],
  controllers: [OtpsController],
  providers: [OtpsService],
  exports: [OtpsService],
})
export class OtpsModule {}

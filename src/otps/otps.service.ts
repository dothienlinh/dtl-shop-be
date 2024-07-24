import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateOtpDto } from './dto/create-otp.dto';
import { Otp } from './schemas/otp.schema';

@Injectable()
export class OtpsService {
  constructor(@InjectModel(Otp.name) private otpModel: Model<Otp>) {}

  async create(createOtpDto: CreateOtpDto) {
    return await this.otpModel.create(createOtpDto);
  }

  async findOne(email: string, otp: number) {
    return await this.otpModel.findOne({ email, otp });
  }

  async remove(email: string, otp: number) {
    return await this.otpModel.deleteOne({ email, otp });
  }
}

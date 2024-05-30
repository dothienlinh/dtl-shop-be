import { CreateOtpDto } from './dto/create-otp.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Otp } from './schemas/otp.schema';
import { Model } from 'mongoose';
import { Injectable } from '@nestjs/common';

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

  async findByEmail(email: string) {
    return await this.otpModel.findOne({ email });
  }
}

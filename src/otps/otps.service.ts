import { CreateOtpDto } from './dto/create-otp.dto';
import { UpdateOtpDto } from './dto/update-otp.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Otp } from './schemas/otp.schema';
import { Model } from 'mongoose';
import { Injectable } from '@nestjs/common';

@Injectable()
export class OtpsService {
  constructor(@InjectModel(Otp.name) private otpModel: Model<Otp>) {}

  async create(createOtpDto: CreateOtpDto) {
    return await this.otpModel.create({ ...createOtpDto });
  }

  async findAll() {
    return await this.otpModel.find();
  }

  async findOne(id: string) {
    return await this.otpModel.findById(id);
  }

  async update(email: string, updateOtpDto: UpdateOtpDto) {
    return await this.otpModel.updateOne({ email }, updateOtpDto);
  }

  async remove(id: string) {
    return await this.otpModel.deleteOne({ _id: id });
  }

  async findByEmail(email: string) {
    return await this.otpModel.findOne({ email });
  }
}

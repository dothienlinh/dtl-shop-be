import { Injectable } from '@nestjs/common';
import { CreateTokenVerifyDto } from './dto/create-token-verify.dto';
import { InjectModel } from '@nestjs/mongoose';
import { TokenVerify } from './schemas/token-verify.schema';
import { Model } from 'mongoose';

@Injectable()
export class TokenVerifyService {
  constructor(@InjectModel(TokenVerify.name) private tokenVerifyModel: Model<TokenVerify>) {}

  async create(createTokenVerifyDto: CreateTokenVerifyDto) {
    return await this.tokenVerifyModel.create(createTokenVerifyDto);
  }

  findAndRemove = async (token: string) => {
    return await this.tokenVerifyModel.findOneAndDelete({ token });
  };
}

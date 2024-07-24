import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateTokenVerifyDto } from './dto/create-token-verify.dto';
import { TokenVerify } from './schemas/token-verify.schema';

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

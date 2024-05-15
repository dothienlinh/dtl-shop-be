import { Injectable } from '@nestjs/common';
import { CreateShopDto } from './dto/create-shop.dto';
import { UpdateShopDto } from './dto/update-shop.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Shop, ShopDocument } from './schemas/shop.schema';
import { SoftDeleteModel } from 'mongoose-delete';
import { IUser } from 'src/interfaces/user.interface';

@Injectable()
export class ShopsService {
  constructor(
    @InjectModel(Shop.name) private shopModel: SoftDeleteModel<ShopDocument>,
  ) {}

  create(createShopDto: CreateShopDto, user: IUser) {
    return this.shopModel.create({
      ...createShopDto,
      user: user.id,
    });
  }

  findAll() {
    return this.shopModel.find();
  }

  findOne(id: string) {
    return this.shopModel.findById(id);
  }

  update(id: string, updateShopDto: UpdateShopDto) {
    return this.shopModel.updateOne({ _id: id }, updateShopDto);
  }

  remove(id: string) {
    return this.shopModel.delete({ _id: id });
  }
}

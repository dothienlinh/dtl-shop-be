import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { SoftDeleteModel } from 'mongoose-delete';
import { IUser } from 'src/common/interfaces/user.interface';
import { CreateShopDto } from './dto/create-shop.dto';
import { UpdateShopDto } from './dto/update-shop.dto';
import { Shop, ShopDocument } from './schemas/shop.schema';

@Injectable()
export class ShopsService {
  constructor(@InjectModel(Shop.name) private shopModel: SoftDeleteModel<ShopDocument>) {}

  create(createShopDto: CreateShopDto, user: IUser) {
    const userMetadata = {
      _id: user.id,
      name: user.name,
      role: user.role,
    };

    return this.shopModel.create({
      ...createShopDto,
      user: user.id,
      createdBy: userMetadata,
      updatedBy: userMetadata,
    });
  }

  findAll() {
    return this.shopModel.find();
  }

  findOne(id: string) {
    return this.shopModel.findById(id);
  }

  update(id: string, updateShopDto: UpdateShopDto, user: IUser) {
    const userMetadata = {
      _id: user.id,
      name: user.name,
      role: user.role,
    };

    return this.shopModel.updateOne(
      { _id: id },
      {
        ...updateShopDto,
        updatedBy: userMetadata,
      },
    );
  }

  remove(id: string) {
    return this.shopModel.delete({ _id: id });
  }
}

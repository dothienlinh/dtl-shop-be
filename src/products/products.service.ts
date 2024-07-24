import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { SoftDeleteModel } from 'mongoose-delete';
import { IUser } from 'src/common/interfaces/user.interface';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Product, ProductDocument } from './schemas/product.schema';

@Injectable()
export class ProductsService {
  constructor(
    @InjectModel(Product.name)
    private productModel: SoftDeleteModel<ProductDocument>,
  ) {}

  async create(createProductDto: CreateProductDto, user: IUser) {
    const userMetadata = {
      _id: user.id,
      name: user.name,
      role: user.role,
    };

    return await this.productModel.create({
      ...createProductDto,
      createdBy: userMetadata,
      updatedBy: userMetadata,
    });
  }

  async findAll() {
    return await this.productModel.find();
  }

  findOne(id: string) {
    return this.productModel.findById(id);
  }

  async update(id: string, updateProductDto: UpdateProductDto, user: IUser) {
    const userMetadata = {
      _id: user.id,
      name: user.name,
      role: user.role,
    };

    return await this.productModel.updateOne(
      { _id: id },
      {
        ...updateProductDto,
        updatedBy: userMetadata,
      },
    );
  }

  async remove(id: string) {
    return this.productModel.delete({ _id: id });
  }
}

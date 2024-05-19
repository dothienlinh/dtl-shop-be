import { Injectable } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Product, ProductDocument } from './schemas/product.schema';
import { SoftDeleteModel } from 'mongoose-delete';
import { IUser } from 'src/interfaces/user.interface';

@Injectable()
export class ProductsService {
  constructor(
    @InjectModel(Product.name)
    private productModel: SoftDeleteModel<ProductDocument>,
  ) {}

  async create(createProductDto: CreateProductDto, user: IUser) {
    return await this.productModel.create({
      ...createProductDto,
      createdBy: {
        _id: user.id,
        name: user.name,
        role: user.role,
      },
      updatedBy: {
        _id: user.id,
        name: user.name,
        role: user.role,
      },
    });
  }

  async findAll() {
    return await this.productModel.find();
  }

  findOne(id: string) {
    return this.productModel.findById(id);
  }

  async update(id: string, updateProductDto: UpdateProductDto, user: IUser) {
    return await this.productModel.updateOne(
      { _id: id },
      {
        ...updateProductDto,
        updatedBy: {
          _id: user.id,
          name: user.name,
          role: user.role,
        },
      },
    );
  }

  async remove(id: string) {
    return this.productModel.delete({ _id: id });
  }
}

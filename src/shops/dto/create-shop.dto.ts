import { IsArray, IsMongoId, IsNotEmpty, IsString } from 'class-validator';
import mongoose from 'mongoose';

export class CreateShopDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  status: string;

  @IsArray()
  @IsNotEmpty()
  @IsMongoId({ each: true })
  products: mongoose.Schema.Types.ObjectId[];

  @IsString()
  @IsNotEmpty()
  typeShop: string;
}

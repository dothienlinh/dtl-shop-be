import { IsArray, IsMongoId, IsNotEmpty, IsNumber, IsString, Min } from 'class-validator';
import mongoose from 'mongoose';

export class CreateProductDto {
  @IsNotEmpty()
  @IsMongoId()
  shop: mongoose.Schema.Types.ObjectId;

  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsString()
  description: string;

  @IsNotEmpty()
  @IsNumber()
  @Min(0)
  price: number;

  @IsNotEmpty()
  @IsNumber()
  @Min(0)
  discount: number;

  @IsNotEmpty()
  @IsString()
  thumbnail: string;

  @IsNotEmpty()
  @IsString({ each: true })
  @IsArray()
  images: string[];

  @IsNotEmpty()
  @IsMongoId()
  category: mongoose.Schema.Types.ObjectId;
}

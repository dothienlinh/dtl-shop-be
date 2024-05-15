import {
  IsArray,
  IsMongoId,
  IsNotEmpty,
  IsNumber,
  IsString,
  Min,
} from 'class-validator';

export class CreateProductDto {
  @IsNotEmpty()
  @IsString()
  @IsMongoId()
  shopId: string;

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
  @IsNumber()
  @Min(0)
  evaluate: number;

  @IsNotEmpty()
  @IsNumber()
  @Min(0)
  sold: number;

  @IsNotEmpty()
  @IsNumber()
  ranting: number;

  @IsNotEmpty()
  @IsString()
  thumbnail: string;

  @IsNotEmpty()
  @IsString({ each: true })
  @IsArray()
  images: string[];

  @IsNotEmpty()
  @IsString()
  categoryId: string;

  @IsNotEmpty()
  @IsString()
  typeShop: string;
}

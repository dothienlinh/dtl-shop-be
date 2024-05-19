import { IsNotEmpty, IsString } from 'class-validator';

export class CreateShopDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  status: string;

  // @IsArray()
  // @IsNotEmpty()
  // @IsMongoId({ each: true })
  // products: mongoose.Schema.Types.ObjectId[];

  @IsString()
  @IsNotEmpty()
  typeShop: string;
}

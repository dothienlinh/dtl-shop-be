import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { Product } from 'src/products/schemas/product.schema';

export type ShopDocument = HydratedDocument<Shop>;

@Schema({ timestamps: true })
export class Shop {
  @Prop()
  user: string;

  @Prop()
  name: string;

  @Prop()
  status: string;

  @Prop({
    type: [mongoose.Schema.Types.ObjectId],
    ref: Product.name,
  })
  products: Product[];

  @Prop({ type: Number, default: 0 })
  following: number;

  @Prop({ type: Number, default: 0 })
  evaluate: number;

  @Prop({ type: Number, default: 0 })
  rating: number;

  @Prop()
  typeShop: string;

  @Prop()
  createdAt: Date;

  @Prop()
  updatedAt: Date;

  @Prop({ type: mongoose.Schema.Types.ObjectId })
  createdBy: mongoose.Schema.Types.ObjectId;

  @Prop({ type: mongoose.Schema.Types.ObjectId })
  updatedBy: mongoose.Schema.Types.ObjectId;
}

export const ShopSchema = SchemaFactory.createForClass(Shop);

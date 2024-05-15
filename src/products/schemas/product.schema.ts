import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';

export type ProductDocument = HydratedDocument<Product>;

@Schema({ timestamps: true })
export class Product {
  @Prop({ type: mongoose.Schema.Types.ObjectId })
  user: string;

  @Prop({ type: mongoose.Schema.Types.ObjectId })
  shop: string;

  @Prop()
  name: string;

  @Prop()
  description: string;

  @Prop()
  price: number;

  @Prop()
  discount: number;

  @Prop({
    type: Number,
    default: 0,
  })
  evaluate: number;

  @Prop({
    type: Number,
    default: 0,
  })
  sold: number;

  @Prop({
    type: Number,
    default: 0,
  })
  ranting: number;

  @Prop()
  thumbnail: string;

  @Prop({ type: [String] })
  images: string[];

  @Prop({ type: mongoose.Schema.Types.ObjectId })
  category: string;

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

export const ProductSchema = SchemaFactory.createForClass(Product);

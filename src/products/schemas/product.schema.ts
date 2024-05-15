import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';

export type ProductDocument = HydratedDocument<Product>;

@Schema({ timestamps: true })
export class Product {
  @Prop({ type: mongoose.Schema.Types.ObjectId })
  userId: string;

  @Prop({ type: mongoose.Schema.Types.ObjectId })
  shopId: string;

  @Prop()
  name: string;

  @Prop()
  description: string;

  @Prop()
  price: number;

  @Prop()
  discount: number;

  @Prop()
  evaluate: number;

  @Prop()
  sold: number;

  @Prop()
  ranting: number;

  @Prop()
  thumbnail: string;

  @Prop()
  images: string[];

  @Prop({ type: mongoose.Schema.Types.ObjectId })
  categoryId: string;

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

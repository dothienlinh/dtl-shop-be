import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { UserReference } from 'src/interfaces/user.interface';

export type ProductDocument = HydratedDocument<Product>;

@Schema({ timestamps: true })
export class Product {
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Shop' })
  shop: mongoose.Schema.Types.ObjectId;

  @Prop()
  name: string;

  @Prop()
  description: string;

  @Prop()
  price: number;

  @Prop()
  discount: number;

  @Prop({
    default: 0,
  })
  evaluate: number;

  @Prop({
    default: 0,
  })
  sold: number;

  @Prop({
    default: 0,
  })
  ranting: number;

  @Prop()
  thumbnail: string;

  @Prop({ type: [String] })
  images: string[];

  @Prop({ type: mongoose.Schema.Types.ObjectId })
  category: mongoose.Schema.Types.ObjectId;

  @Prop()
  createdAt: Date;

  @Prop()
  updatedAt: Date;

  @Prop({ type: Object })
  createdBy: UserReference;

  @Prop({ type: Object })
  updatedBy: UserReference;
}

export const ProductSchema = SchemaFactory.createForClass(Product);

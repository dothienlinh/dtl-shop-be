import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { UserReference } from 'src/interfaces/user.interface';

export type ShopDocument = HydratedDocument<Shop>;

@Schema({ timestamps: true })
export class Shop {
  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  })
  user: mongoose.Schema.Types.ObjectId;

  @Prop()
  name: string;

  @Prop()
  status: string;

  @Prop({
    type: [mongoose.Schema.Types.ObjectId],
    ref: 'Product',
    default: null,
  })
  products: mongoose.Schema.Types.ObjectId[];

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

  @Prop({ type: Object })
  createdBy: UserReference;

  @Prop({ type: Object })
  updatedBy: UserReference;
}

export const ShopSchema = SchemaFactory.createForClass(Shop);

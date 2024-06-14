import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type TokenVerifyDocument = HydratedDocument<TokenVerify>;

@Schema()
export class TokenVerify {
  @Prop()
  token: string;

  @Prop({ default: Date.now(), type: Date, expires: 60 * 5 })
  createdAt: Date;
}

export const TokenVerifySchema = SchemaFactory.createForClass(TokenVerify);

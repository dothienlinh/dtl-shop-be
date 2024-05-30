import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type OtpDocument = HydratedDocument<Otp>;

@Schema()
export class Otp {
  @Prop()
  email: string;

  @Prop({ default: null })
  otp: number;

  @Prop({ default: Date.now(), type: Date, expires: 60 * 5 })
  createdAt: Date;
}

export const OtpSchema = SchemaFactory.createForClass(Otp);

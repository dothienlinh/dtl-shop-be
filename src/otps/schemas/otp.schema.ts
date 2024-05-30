import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type OtpDocument = HydratedDocument<Otp>;

@Schema()
export class Otp {
  @Prop()
  email: string;

  @Prop({ default: null })
  otp: string;

  @Prop({ default: null })
  expiry: Date;
}

export const OtpSchema = SchemaFactory.createForClass(Otp);

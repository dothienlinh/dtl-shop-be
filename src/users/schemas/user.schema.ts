import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { Gender } from '../dto/create-user.dto';
import { UserReference } from 'src/interfaces/user.interface';

export type UserDocument = HydratedDocument<User>;

@Schema({ timestamps: true })
export class User {
  @Prop()
  email: string;

  @Prop()
  password: string;

  @Prop()
  name: string;

  @Prop()
  userName: string;

  @Prop({ default: null })
  avarta: string;

  @Prop()
  phoneNumber: string;

  @Prop({ type: String, enum: Gender, default: null })
  gender: Gender;

  @Prop({ type: Date, default: null })
  birthDate: Date;

  @Prop()
  role: string;

  @Prop()
  address: string;

  @Prop()
  refreshToken: string;

  @Prop()
  createdAt: Date;

  @Prop()
  updatedAt: Date;

  @Prop({ type: Object })
  createdBy: UserReference;

  @Prop({ type: Object })
  updatedBy: UserReference;
}

export const UserSchema = SchemaFactory.createForClass(User);

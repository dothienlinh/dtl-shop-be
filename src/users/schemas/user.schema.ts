import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { EGender } from 'src/enums/user';
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

  @Prop({ type: String, enum: EGender, default: null })
  gender: EGender;

  @Prop({ type: Date, default: null })
  birthDate: Date;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Role',
  })
  role: mongoose.Schema.Types.ObjectId;

  @Prop()
  address: string;

  @Prop({ type: Boolean, default: false })
  isVerify: boolean;

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

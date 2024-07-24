import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { UserReference } from 'src/common/interfaces/user.interface';

export type ChatDocument = HydratedDocument<Chat>;

@Schema({ timestamps: true })
export class Chat {
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User' })
  receiver: mongoose.Schema.Types.ObjectId;

  @Prop()
  sender: mongoose.Schema.Types.ObjectId;

  @Prop()
  message: string;

  @Prop()
  createdAt: Date;

  @Prop()
  updatedAt: Date;

  @Prop({ type: Object })
  createdBy: UserReference;

  @Prop({ type: Object })
  updatedBy: UserReference;
}

export const ChatSchema = SchemaFactory.createForClass(Chat);

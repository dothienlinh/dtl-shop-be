import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { UserReference } from 'src/interfaces/user.interface';

export type RoleDocument = HydratedDocument<Role>;

@Schema({ timestamps: true })
export class Role {
  @Prop()
  name: string;

  @Prop()
  description: string;

  @Prop({
    type: [mongoose.Schema.Types.ObjectId],
    ref: 'Permission',
  })
  permissions: mongoose.Schema.Types.ObjectId[];

  @Prop()
  isActive: boolean;

  @Prop()
  createdAt: Date;

  @Prop()
  updatedAt: Date;

  @Prop({ type: Object })
  createdBy: UserReference;

  @Prop({ type: Object })
  updatedBy: UserReference;
}

export const RoleSchema = SchemaFactory.createForClass(Role);

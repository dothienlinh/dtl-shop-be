import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { UserReference } from 'src/interfaces/user.interface';

export type PermissionDocument = HydratedDocument<Permission>;

@Schema({ timestamps: true })
export class Permission {
  @Prop()
  name: string;

  @Prop()
  apiPath: string;

  @Prop()
  method: string;

  @Prop()
  module: string;

  @Prop()
  createdAt: Date;

  @Prop()
  updatedAt: Date;

  @Prop({ type: Object })
  createdBy: UserReference;

  @Prop({ type: Object })
  updatedBy: UserReference;
}

export const PermissionSchema = SchemaFactory.createForClass(Permission);

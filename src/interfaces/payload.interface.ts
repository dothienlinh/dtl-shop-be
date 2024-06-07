import mongoose from 'mongoose';

export interface IPayload {
  email: string;
  sub: string | mongoose.Types.ObjectId;
  name: string;
  role:
    | {
        _id: string | mongoose.Schema.Types.ObjectId;
        name: string;
      }
    | mongoose.Schema.Types.ObjectId;
  iat?: number;
  exp?: number;
}

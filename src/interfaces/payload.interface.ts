import mongoose from 'mongoose';

export interface IPayload {
  email: string;
  sub: string | mongoose.Types.ObjectId;
  name: string;
  role: string | mongoose.Schema.Types.ObjectId;
  permissions?: Permission[];
  iat?: number;
  exp?: number;
}

export interface Permission {
  _id: string | mongoose.Schema.Types.ObjectId;
  name: string;
  apiPath: string;
  method: string;
  module: string;
}

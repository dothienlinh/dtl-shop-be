import { Types } from 'mongoose';

export interface IPayload {
  email: string;
  sub: string | Types.ObjectId;
  name: string;
  iat?: number;
  exp?: number;
}

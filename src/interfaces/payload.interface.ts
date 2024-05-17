import { Types } from 'mongoose';

export interface IPayload {
  email: string;
  sub: string | Types.ObjectId;
  name: string;
  role: string;
  iat?: number;
  exp?: number;
}

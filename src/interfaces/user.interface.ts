import mongoose from 'mongoose';

export interface IUser {
  id: string;
  email: string;
  name: string;
  role: string;
}

export interface UserReference {
  _id: mongoose.Schema.Types.ObjectId;
  name: string;
  role: string;
}

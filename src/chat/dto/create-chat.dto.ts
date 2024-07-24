import { IsMongoId, IsNotEmpty, IsString } from 'class-validator';
import mongoose from 'mongoose';

export class CreateChatDto {
  @IsString()
  @IsNotEmpty()
  message: string;

  @IsMongoId()
  @IsNotEmpty()
  @IsString()
  receiver: mongoose.Schema.Types.ObjectId | string;
}

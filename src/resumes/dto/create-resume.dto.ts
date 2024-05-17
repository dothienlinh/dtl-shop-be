import { IsMongoId, IsNotEmpty, IsString } from 'class-validator';
import mongoose from 'mongoose';

export class CreateResumeDto {
  @IsString()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  @IsMongoId()
  userId: mongoose.Schema.Types.ObjectId;

  @IsString()
  @IsNotEmpty()
  url: string;

  @IsString()
  @IsNotEmpty()
  status: string;

  @IsString()
  @IsNotEmpty()
  @IsMongoId()
  companyId: mongoose.Schema.Types.ObjectId;

  @IsString()
  @IsNotEmpty()
  @IsMongoId()
  jobId: mongoose.Schema.Types.ObjectId;
}

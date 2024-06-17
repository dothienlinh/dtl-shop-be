import { IsEnum, IsMongoId, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import mongoose from 'mongoose';
import { ERole } from 'src/enums/role';

export class SearchUsersDto {
  @IsString()
  @IsMongoId()
  @IsOptional()
  _id: mongoose.Schema.Types.ObjectId;

  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  email?: string;

  @IsNotEmpty()
  @IsEnum(ERole, { each: true })
  role?: ERole[];
}

import {
  IsArray,
  IsBoolean,
  IsEnum,
  IsMongoId,
  IsNotEmpty,
  IsString,
} from 'class-validator';
import mongoose from 'mongoose';
import { ERole } from 'src/enums/role';

export class CreateRoleDto {
  @IsString()
  @IsNotEmpty()
  @IsEnum(ERole)
  name: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsArray()
  @IsMongoId({ each: true })
  @IsNotEmpty()
  permissions: mongoose.Schema.Types.ObjectId[];

  @IsBoolean()
  @IsNotEmpty()
  isActive: boolean;
}

import { IsNotEmpty, IsString } from 'class-validator';

export enum Gender {
  MALE = 'MALE',
  FEMALE = 'FEMALE',
  OTHERS = 'OTHERS',
}

export class CreateUserDto {
  @IsString()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  password: string;

  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  userName: string;

  @IsString()
  @IsNotEmpty()
  phoneNumber: string;

  // @IsString()
  // @IsNotEmpty()
  // @IsEnum(Gender)
  // @ApiProperty({ enum: Gender })
  // gender: string;

  @IsString()
  @IsNotEmpty()
  role: string;

  // @IsString()
  // @IsNotEmpty()
  // address: string;
}

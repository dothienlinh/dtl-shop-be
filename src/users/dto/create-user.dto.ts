import { IsDateString, IsNotEmpty, IsNumber, IsString } from 'class-validator';

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
  avarta: string;

  @IsString()
  @IsNotEmpty()
  phoneNumber: string;

  @IsNumber()
  @IsNotEmpty()
  gender: number;

  @IsDateString()
  @IsNotEmpty()
  birthDate: string;

  @IsNumber()
  @IsNotEmpty()
  role: string;

  @IsString()
  @IsNotEmpty()
  address: string;
}

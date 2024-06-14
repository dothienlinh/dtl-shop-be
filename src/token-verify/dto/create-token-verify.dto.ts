import { IsNotEmpty, IsString } from 'class-validator';

export class CreateTokenVerifyDto {
  @IsNotEmpty()
  @IsString()
  token: string;
}

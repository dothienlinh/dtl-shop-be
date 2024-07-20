import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';
import { Match } from 'src/decorators/match.decorator';

export class AuthRegisterDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ example: 'example@gmail.com', description: 'email' })
  readonly email: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    example: '12345678',
    description: 'password',
  })
  readonly password: string;

  @IsString()
  @IsNotEmpty()
  @Match('password')
  @ApiProperty({
    example: '12345678',
    description: 'passwordConfirm',
  })
  readonly passwordConfirm: string;
}

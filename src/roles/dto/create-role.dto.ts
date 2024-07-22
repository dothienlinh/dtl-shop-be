import { IsBoolean, IsEnum, IsNotEmpty, IsString } from 'class-validator';
import { ERole } from 'src/common/enums/role';

export class CreateRoleDto {
  @IsString()
  @IsNotEmpty()
  @IsEnum(ERole)
  name: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsBoolean()
  @IsNotEmpty()
  isActive: boolean;
}

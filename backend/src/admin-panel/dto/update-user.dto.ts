import { IsEnum, IsOptional } from 'class-validator';
import { Role } from '../../users/enums/role.enum';

export class UpdateUserDto {
  @IsOptional()
  @IsEnum(Role)
  role?: Role;
} 
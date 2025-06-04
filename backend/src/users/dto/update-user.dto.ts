import { PartialType } from '@nestjs/mapped-types';
import { CreateUserDto } from './create-user.dto';
import { IsString, IsOptional, IsEmail, MinLength, IsEnum } from 'class-validator';
import { Role } from '../entities/user.entity';

export class UpdateUserDto extends PartialType(CreateUserDto) {
  // Override fields from CreateUserDto to make them optional and add validation if needed
  @IsOptional()
  @IsString()
  @MinLength(3)
  username?: string;

  @IsOptional()
  @IsEmail()
  email?: string;

  @IsOptional()
  @IsString()
  @MinLength(6)
  password?: string;

  // Password should be updated via a separate secure method
  // Role update should be handled with specific admin permissions

  // Example: Allowing admin to update role (optional and with validation)
  @IsOptional()
  @IsEnum(Role)
  role?: Role;
} 
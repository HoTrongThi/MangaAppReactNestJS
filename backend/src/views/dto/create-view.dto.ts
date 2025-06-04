import { IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateViewDto {
  @IsNumber()
  chapterId: number;

  @IsOptional()
  @IsString()
  ip_address?: string;

  @IsOptional()
  @IsString()
  user_agent?: string;
} 
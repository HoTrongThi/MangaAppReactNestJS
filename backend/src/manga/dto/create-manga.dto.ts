import { IsString, IsNotEmpty, IsOptional, IsArray } from 'class-validator';

export class CreateMangaDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsString()
  @IsNotEmpty()
  author: string;

  @IsString()
  @IsNotEmpty()
  status: string;

  @IsString()
  @IsNotEmpty()
  coverFileName: string;

  @IsString()
  @IsOptional()
  source?: string;

  @IsArray()
  @IsString({ each: true })
  @IsNotEmpty()
  genres: string[];
} 
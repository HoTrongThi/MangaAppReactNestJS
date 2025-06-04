import { IsString, IsNotEmpty, IsOptional, IsArray, IsNumber } from 'class-validator';

export class CreateMangaDto {
  @IsString()
  @IsNotEmpty()
  mangaDexId: string;

  @IsNotEmpty()
  title: any; // JSON object for multilingual titles

  @IsOptional()
  description?: any; // JSON object for multilingual descriptions

  @IsString()
  @IsOptional()
  coverFileName?: string;

  @IsString()
  @IsOptional()
  author?: string;

  @IsString()
  @IsOptional()
  artist?: string;

  @IsString()
  @IsOptional()
  status?: string;

  @IsString()
  @IsOptional()
  type?: string;

  @IsString()
  @IsOptional()
  source?: string;

  @IsString()
  @IsOptional()
  source_id?: string;

  @IsOptional()
  metadata?: any;

  @IsArray()
  @IsNumber({}, { each: true })
  @IsOptional()
  genreIds?: number[];
} 
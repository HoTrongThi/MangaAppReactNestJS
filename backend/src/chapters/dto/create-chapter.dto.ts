import { IsString, IsNotEmpty, IsNumber, IsOptional, IsArray } from 'class-validator';

export class CreateChapterDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsNumber()
  @IsNotEmpty()
  chapterNumber: number;

  @IsString()
  @IsOptional()
  volumeNumber?: string;

  @IsArray()
  @IsOptional()
  pages?: any[];

  @IsString()
  @IsOptional()
  source?: string;

  @IsString()
  @IsOptional()
  source_id?: string;

  @IsOptional()
  metadata?: any;
} 
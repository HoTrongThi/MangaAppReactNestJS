import { PartialType } from '@nestjs/mapped-types';
import { CreateMangaDto } from './create-manga.dto';
import { IsArray, IsNumber, IsOptional } from 'class-validator';

export class UpdateMangaDto extends PartialType(CreateMangaDto) {
  @IsArray()
  @IsNumber({}, { each: true })
  @IsOptional()
  genreIds?: number[];
} 
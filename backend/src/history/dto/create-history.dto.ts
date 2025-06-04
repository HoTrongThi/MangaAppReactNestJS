import { IsNumber, IsNotEmpty } from 'class-validator';

export class CreateHistoryDto {
  @IsNumber()
  @IsNotEmpty()
  mangaId: number;

  @IsNumber()
  @IsNotEmpty()
  chapterNumber: number;

  @IsNumber()
  @IsNotEmpty()
  pageNumber: number;
} 
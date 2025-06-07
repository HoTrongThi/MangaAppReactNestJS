import { IsNumber, IsNotEmpty } from 'class-validator';
import { IsUUID } from 'class-validator';

export class CreateHistoryDto {
  @IsUUID()
  @IsNotEmpty()
  mangaId: string;

  @IsNumber()
  @IsNotEmpty()
  chapterNumber: number;

  @IsNumber()
  @IsNotEmpty()
  pageNumber: number;
} 
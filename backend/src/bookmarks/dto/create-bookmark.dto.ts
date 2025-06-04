import { IsNotEmpty, IsNumber } from 'class-validator';

export class CreateBookmarkDto {
  @IsNotEmpty()
  @IsNumber()
  mangaId: number; // The ID of the manga to bookmark

  // userId will typically be extracted from the JWT payload, not passed in the body
} 
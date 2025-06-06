import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateBookmarkDto {
  @IsNotEmpty()
  @IsString()
  mangaId: string; // Change type to string (MangaDex ID)

  // userId will typically be extracted from the JWT payload, not passed in the body
} 
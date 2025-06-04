import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RatingsService } from './ratings.service';
import { RatingsController } from './ratings.controller';
import { Rating } from './entities/rating.entity';
import { User } from '../users/entities/user.entity';
import { Manga } from '../manga/entities/manga.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Rating, User, Manga])],
  controllers: [RatingsController],
  providers: [RatingsService],
})
export class RatingsModule {}

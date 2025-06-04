import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CommentsService } from './comments.service';
import { CommentsController } from './comments.controller';
import { Comment } from './entities/comment.entity';
import { User } from '../users/entities/user.entity';
import { Manga } from '../manga/entities/manga.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Comment, User, Manga])],
  controllers: [CommentsController],
  providers: [CommentsService],
})
export class CommentsModule {}

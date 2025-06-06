import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ContributorPanelController } from './contributor-panel.controller';
import { ContributorPanelService } from './contributor-panel.service';
import { Manga } from '../manga/entities/manga.entity';
import { Chapter } from '../chapters/entities/chapter.entity';
import { Comment } from '../comments/entities/comment.entity';
import { CommentsModule } from '../comments/comments.module';
import { MangaModule } from '../manga/manga.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Manga, Chapter, Comment]),
    CommentsModule,
    MangaModule,
  ],
  controllers: [ContributorPanelController],
  providers: [ContributorPanelService],
  exports: [ContributorPanelService]
})
export class ContributorPanelModule {} 
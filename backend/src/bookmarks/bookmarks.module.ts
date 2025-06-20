import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BookmarksService } from './bookmarks.service';
import { BookmarksController } from './bookmarks.controller';
import { Bookmark } from './entities/bookmark.entity';
import { User } from '../users/entities/user.entity';
import { Manga } from '../manga/entities/manga.entity';
import { MangaModule } from '../manga/manga.module';

@Module({
  imports: [TypeOrmModule.forFeature([Bookmark, User, Manga]), MangaModule],
  controllers: [BookmarksController],
  providers: [BookmarksService],
  exports: [BookmarksService]
})
export class BookmarksModule {}

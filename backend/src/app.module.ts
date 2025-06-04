import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { MangaModule } from './manga/manga.module';
import { GenresModule } from './genres/genres.module';
import { BookmarksModule } from './bookmarks/bookmarks.module';
import { HistoryModule } from './history/history.module';
import { RatingsModule } from './ratings/ratings.module';
import { CommentsModule } from './comments/comments.module';
import { ChaptersModule } from './chapters/chapters.module';
import { ViewsModule } from './views/views.module';
import { AdminPanelModule } from './admin-panel/admin-panel.module';
import { User } from './users/entities/user.entity';
import { Genre } from './genres/entities/genre.entity';
import { Manga } from './manga/entities/manga.entity';
import { Chapter } from './chapters/entities/chapter.entity';
import { Bookmark } from './bookmarks/entities/bookmark.entity';
import { History } from './history/entities/history.entity';
import { Rating } from './ratings/entities/rating.entity';
import { Comment } from './comments/entities/comment.entity';
import { View } from './views/entities/view.entity';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        type: 'mysql',
        host: configService.get('DB_HOST', 'localhost'),
        port: +configService.get('DB_PORT', 3306),
        username: configService.get('DB_USERNAME', 'root'),
        password: configService.get('DB_PASSWORD', ''),
        database: configService.get('DB_DATABASE', 'manga_app'),
        entities: [
          User,
          Genre,
          Manga,
          Chapter,
          Bookmark,
          History,
          Rating,
          Comment,
          View,
        ],
        synchronize: configService.get('NODE_ENV') !== 'production',
      }),
      inject: [ConfigService],
    }),
    UsersModule,
    AuthModule,
    MangaModule,
    GenresModule,
    BookmarksModule,
    HistoryModule,
    RatingsModule,
    CommentsModule,
    ChaptersModule,
    ViewsModule,
    AdminPanelModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HistoryService } from './history.service';
import { HistoryController } from './history.controller';
import { History } from './entities/history.entity';
import { User } from '../users/entities/user.entity';
import { Manga } from '../manga/entities/manga.entity';

@Module({
  imports: [TypeOrmModule.forFeature([History, User, Manga])],
  controllers: [HistoryController],
  providers: [HistoryService],
})
export class HistoryModule {}

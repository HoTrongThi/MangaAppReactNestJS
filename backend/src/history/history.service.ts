import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { History } from './entities/history.entity';
import { CreateHistoryDto } from './dto/create-history.dto';
import { User } from '../users/entities/user.entity';
import { Manga } from '../manga/entities/manga.entity';

@Injectable()
export class HistoryService {
  constructor(
    @InjectRepository(History)
    private historyRepository: Repository<History>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(Manga)
    private mangaRepository: Repository<Manga>,
  ) {}

  async create(userId: number, createHistoryDto: CreateHistoryDto): Promise<History> {
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new NotFoundException('User not found');
    }

    const manga = await this.mangaRepository.findOne({ where: { id: createHistoryDto.mangaId } });
    if (!manga) {
      throw new NotFoundException('Manga not found');
    }

    // Check if history already exists for this user and manga
    let history = await this.historyRepository.findOne({
      where: {
        user: { id: userId },
        manga: { id: createHistoryDto.mangaId },
      },
    });

    if (history) {
      // Update existing history
      history.chapterNumber = createHistoryDto.chapterNumber;
      history.pageNumber = createHistoryDto.pageNumber;
    } else {
      // Create new history
      history = this.historyRepository.create({
        user,
        manga,
        chapterNumber: createHistoryDto.chapterNumber,
        pageNumber: createHistoryDto.pageNumber,
      });
    }

    return this.historyRepository.save(history);
  }

  async findAll(userId: number): Promise<History[]> {
    return this.historyRepository.find({
      where: { user: { id: userId } },
      relations: ['manga'],
      order: { updatedAt: 'DESC' },
    });
  }

  async findOne(userId: number, mangaId: number): Promise<History> {
    const history = await this.historyRepository.findOne({
      where: {
        user: { id: userId },
        manga: { id: mangaId },
      },
      relations: ['manga'],
    });

    if (!history) {
      throw new NotFoundException('History not found');
    }

    return history;
  }

  async remove(userId: number, mangaId: number): Promise<void> {
    const result = await this.historyRepository.delete({
      user: { id: userId },
      manga: { id: mangaId },
    });

    if (result.affected === 0) {
      throw new NotFoundException('History not found');
    }
  }
} 
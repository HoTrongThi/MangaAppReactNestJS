import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { View } from './entities/view.entity';
import { CreateViewDto } from './dto/create-view.dto';
import { Chapter } from '../chapters/entities/chapter.entity';
import { User } from '../users/entities/user.entity';

@Injectable()
export class ViewsService {
  constructor(
    @InjectRepository(View)
    private viewRepository: Repository<View>,
    @InjectRepository(Chapter)
    private chapterRepository: Repository<Chapter>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async create(createViewDto: CreateViewDto, userId: number): Promise<View> {
    const chapter = await this.chapterRepository.findOne({
      where: { id: createViewDto.chapterId },
      relations: ['manga'],
    });

    if (!chapter) {
      throw new NotFoundException('Chapter not found');
    }

    // Kiểm tra xem manga có phải là nội bộ không
    if (chapter.manga.source !== 'internal') {
      throw new Error('Views can only be recorded for internal manga');
    }

    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new NotFoundException('User not found');
    }

    const view = this.viewRepository.create({
      ...createViewDto,
      chapter,
      user,
    });

    return this.viewRepository.save(view);
  }

  async getChapterViews(chapterId: number): Promise<number> {
    return this.viewRepository.count({
      where: { chapter: { id: chapterId } },
    });
  }

  async getMangaViews(mangaId: number): Promise<number> {
    return this.viewRepository.count({
      where: { chapter: { manga: { id: mangaId } } },
    });
  }

  async getTopViewedChapters(mangaId: number, limit: number = 10): Promise<any[]> {
    return this.viewRepository
      .createQueryBuilder('view')
      .select('chapter.id', 'chapterId')
      .addSelect('chapter.title', 'title')
      .addSelect('chapter.chapterNumber', 'chapterNumber')
      .addSelect('COUNT(view.id)', 'viewCount')
      .innerJoin('view.chapter', 'chapter')
      .where('chapter.manga.id = :mangaId', { mangaId })
      .groupBy('chapter.id')
      .orderBy('viewCount', 'DESC')
      .limit(limit)
      .getRawMany();
  }

  async getTopViewedManga(limit: number = 10): Promise<any[]> {
    return this.viewRepository
      .createQueryBuilder('view')
      .select('manga.id', 'mangaId')
      .addSelect('manga.title', 'title')
      .addSelect('COUNT(view.id)', 'viewCount')
      .innerJoin('view.chapter', 'chapter')
      .innerJoin('chapter.manga', 'manga')
      .where('manga.source = :source', { source: 'internal' })
      .groupBy('manga.id')
      .orderBy('viewCount', 'DESC')
      .limit(limit)
      .getRawMany();
  }
} 
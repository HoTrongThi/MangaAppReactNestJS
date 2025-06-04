import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Chapter } from './entities/chapter.entity';
import { CreateChapterDto } from './dto/create-chapter.dto';
import { UpdateChapterDto } from './dto/update-chapter.dto';
import { Manga } from '../manga/entities/manga.entity';

@Injectable()
export class ChaptersService {
  constructor(
    @InjectRepository(Chapter)
    private chapterRepository: Repository<Chapter>,
    @InjectRepository(Manga)
    private mangaRepository: Repository<Manga>,
  ) {}

  async create(mangaId: number, createChapterDto: CreateChapterDto): Promise<Chapter> {
    const manga = await this.mangaRepository.findOne({ where: { id: mangaId } });
    if (!manga) {
      throw new NotFoundException('Manga not found');
    }

    // Check if chapter number already exists
    const existingChapter = await this.chapterRepository.findOne({
      where: {
        manga: { id: mangaId },
        chapterNumber: createChapterDto.chapterNumber,
      },
    });

    if (existingChapter) {
      throw new BadRequestException('Chapter number already exists');
    }

    const chapter = this.chapterRepository.create({
      ...createChapterDto,
      manga,
    });

    return this.chapterRepository.save(chapter);
  }

  async findAll(mangaId: number): Promise<Chapter[]> {
    return this.chapterRepository.find({
      where: { manga: { id: mangaId } },
      order: { chapterNumber: 'ASC' },
    });
  }

  async findAllByManga(mangaId: number): Promise<Chapter[]> {
    return this.chapterRepository.find({
      where: { manga: { id: mangaId } },
      order: { chapterNumber: 'ASC' },
    });
  }

  async findOne(id: number): Promise<Chapter> {
    const chapter = await this.chapterRepository.findOne({
      where: { id },
      relations: ['manga'],
    });

    if (!chapter) {
      throw new NotFoundException('Chapter not found');
    }

    return chapter;
  }

  async update(id: number, updateChapterDto: UpdateChapterDto): Promise<Chapter> {
    const chapter = await this.findOne(id);

    // If updating chapter number, check if it already exists
    if (updateChapterDto.chapterNumber && updateChapterDto.chapterNumber !== chapter.chapterNumber) {
      const existingChapter = await this.chapterRepository.findOne({
        where: {
          manga: { id: chapter.manga.id },
          chapterNumber: updateChapterDto.chapterNumber,
        },
      });

      if (existingChapter) {
        throw new BadRequestException('Chapter number already exists');
      }
    }

    Object.assign(chapter, updateChapterDto);
    return this.chapterRepository.save(chapter);
  }

  async remove(id: number): Promise<void> {
    const result = await this.chapterRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException('Chapter not found');
    }
  }
} 
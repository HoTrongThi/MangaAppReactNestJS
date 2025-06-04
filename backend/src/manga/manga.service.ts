import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Manga } from './entities/manga.entity';
import { CreateMangaDto } from './dto/create-manga.dto';
import { UpdateMangaDto } from './dto/update-manga.dto';
import { Genre } from '../genres/entities/genre.entity';

@Injectable()
export class MangaService {
  constructor(
    @InjectRepository(Manga)
    private mangaRepository: Repository<Manga>,
    @InjectRepository(Genre)
    private genreRepository: Repository<Genre>,
  ) {}

  async create(createMangaDto: CreateMangaDto): Promise<Manga> {
    // Check if mangaDexId already exists
    const existingManga = await this.mangaRepository.findOne({
      where: { mangaDexId: createMangaDto.mangaDexId },
    });

    if (existingManga) {
      throw new BadRequestException('Manga with this MangaDex ID already exists');
    }

    const manga = this.mangaRepository.create(createMangaDto);

    // Handle genres if provided
    if (createMangaDto.genreIds && createMangaDto.genreIds.length > 0) {
      const genres = await this.genreRepository.findByIds(createMangaDto.genreIds);
      manga.genres = genres;
    }

    return this.mangaRepository.save(manga);
  }

  async findAll(): Promise<Manga[]> {
    return this.mangaRepository.find({
      relations: ['genres'],
    });
  }

  async findOne(id: number): Promise<Manga> {
    const manga = await this.mangaRepository.findOne({
      where: { id },
      relations: ['genres', 'chapters'],
    });

    if (!manga) {
      throw new NotFoundException('Manga not found');
    }

    return manga;
  }

  async update(id: number, updateMangaDto: UpdateMangaDto): Promise<Manga> {
    const manga = await this.findOne(id);

    // Handle genres if provided
    if (updateMangaDto.genreIds) {
      const genres = await this.genreRepository.findByIds(updateMangaDto.genreIds);
      manga.genres = genres;
    }

    // Update other fields
    Object.assign(manga, updateMangaDto);

    return this.mangaRepository.save(manga);
  }

  async remove(id: number): Promise<void> {
    const result = await this.mangaRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException('Manga not found');
    }
  }

  async findByMangaDexId(mangaDexId: string): Promise<Manga> {
    const manga = await this.mangaRepository.findOne({
      where: { mangaDexId },
      relations: ['genres', 'chapters'],
    });

    if (!manga) {
      throw new NotFoundException('Manga not found');
    }

    return manga;
  }

  async findByUserId(userId: number): Promise<Manga[]> {
    return this.mangaRepository
      .createQueryBuilder('manga')
      .leftJoinAndSelect('manga.user', 'user')
      .where('user.id = :userId', { userId })
      .getMany();
  }
} 
import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Manga } from './entities/manga.entity';
import { CreateMangaDto } from './dto/create-manga.dto';
import { UpdateMangaDto } from './dto/update-manga.dto';
import { Genre } from '../genres/entities/genre.entity';
import { ILike, Like } from 'typeorm';

@Injectable()
export class MangaService {
  constructor(
    @InjectRepository(Manga)
    private mangaRepository: Repository<Manga>,
    @InjectRepository(Genre)
    private genreRepository: Repository<Genre>,
  ) {}

  async create(createMangaDto: CreateMangaDto & { userId: number }): Promise<Manga> {
    const manga = this.mangaRepository.create({
      title: createMangaDto.title,
      description: createMangaDto.description,
      author: createMangaDto.author,
      status: createMangaDto.status,
      coverFileName: createMangaDto.coverFileName,
      userId: createMangaDto.userId,
      source: createMangaDto.source || 'internal',
    });

    // Handle genres
    if (createMangaDto.genres && createMangaDto.genres.length > 0) {
      const genres = await Promise.all(
        createMangaDto.genres.map(async (genreName) => {
          let genre = await this.genreRepository.findOne({
            where: { name: genreName }
          });

          if (!genre) {
            genre = this.genreRepository.create({ name: genreName });
            await this.genreRepository.save(genre);
          }

          return genre;
        })
      );
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

  async findByUserId(userId: number): Promise<Manga[]> {
    return this.mangaRepository.find({
      where: { userId },
      relations: ['genres'],
    });
  }

  async searchManga(query: string): Promise<Manga[]> {
    if (!query || typeof query !== 'string' || !query.trim()) {
      return [];
    }
    try {
      return await this.mangaRepository.find({
        where: [
          { title: Like(`%${query}%`) },
          { author: Like(`%${query}%`) }
        ].filter(condition => {
          return Object.values(condition)[0] !== undefined && Object.values(condition)[0] !== null;
        }),
        relations: ['genres'],
      });
    } catch (error) {
      console.error('Error in searchManga:', error);
      return [];
    }
  }
} 
import { Injectable, ConflictException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Bookmark } from './entities/bookmark.entity';
import { User } from '../users/entities/user.entity';
import { Manga } from '../manga/entities/manga.entity';

@Injectable()
export class BookmarksService {
  constructor(
    @InjectRepository(Bookmark) // Inject Bookmark Repository
    private bookmarksRepository: Repository<Bookmark>,
    @InjectRepository(User) // Inject User Repository to find user
    private usersRepository: Repository<User>,
    @InjectRepository(Manga) // Inject Manga Repository to find manga
    private mangaRepository: Repository<Manga>,
  ) {}

  async create(userId: number, mangaId: number): Promise<Bookmark> {
    // Check if bookmark already exists
    const existingBookmark = await this.bookmarksRepository.findOne({
      where: { user: { id: userId }, manga: { id: mangaId } },
    });

    if (existingBookmark) {
      throw new ConflictException('Bookmark already exists');
    }

    // Basic check if user and manga exist (optional depending on foreign key constraints setup)
    // const user = await this.usersRepository.findOneBy({ id: userId });
    // const manga = await this.mangaRepository.findOneBy({ id: mangaId });
    // if (!user || !manga) {
    //   throw new NotFoundException('User or Manga not found');
    // }

    const newBookmark = this.bookmarksRepository.create({
      user: { id: userId }, // Link by ID
      manga: { id: mangaId }, // Link by ID
    });

    return this.bookmarksRepository.save(newBookmark);
  }

  async findAllForUser(userId: number): Promise<Bookmark[]> {
    return this.bookmarksRepository.find({
      where: { user: { id: userId } },
      relations: ['manga'], // Load related manga data
    });
  }

  async remove(userId: number, mangaId: number): Promise<void> {
    const result = await this.bookmarksRepository.delete({
      user: { id: userId },
      manga: { id: mangaId },
    });

    if (result.affected === 0) {
      throw new NotFoundException('Bookmark not found');
    }
  }
}

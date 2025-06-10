import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Manga } from '../manga/entities/manga.entity';
import { Chapter } from '../chapters/entities/chapter.entity';
import { CommentsService } from '../comments/comments.service';
import { Comment } from '../comments/entities/comment.entity';
import { MangaService } from '../manga/manga.service';
import { In } from 'typeorm';
import { ChapterImage } from '../chapters/entities/chapter-image.entity';

@Injectable()
export class ContributorPanelService {
  constructor(
    @InjectRepository(Manga)
    private mangaRepository: Repository<Manga>,
    @InjectRepository(Chapter)
    private chapterRepository: Repository<Chapter>,
    @InjectRepository(Comment)
    private commentRepository: Repository<Comment>,
    @InjectRepository(ChapterImage)
    private chapterImageRepository: Repository<ChapterImage>,
    private mangaService: MangaService,
  ) {}

  // Get all manga created by the contributor
  async getMyManga(userId: number) {
    return this.mangaRepository.find({
      where: { user: { id: userId } },
      relations: ['chapters', 'genres'],
    });
  }

  // Get a specific manga created by the contributor
  async getMyMangaById(id: number, userId: number) {
    const manga = await this.mangaRepository.findOne({
      where: { id, user: { id: userId } },
      relations: ['chapters', 'genres'],
    });

    if (!manga) {
      throw new NotFoundException('Manga not found');
    }

    return manga;
  }

  // Update a manga created by the contributor
  async updateMyManga(id: number, updateData: Partial<Manga>, userId: number) {
    const manga = await this.mangaRepository.findOne({
      where: { id, user: { id: userId } },
    });

    if (!manga) {
      throw new NotFoundException('Manga not found');
    }

    Object.assign(manga, updateData);
    return this.mangaRepository.save(manga);
  }

  // Delete a manga created by the contributor
  async deleteMyManga(id: number, userId: number) {
    const manga = await this.mangaRepository.findOne({
      where: { id, user: { id: userId } },
    });

    if (!manga) {
      throw new NotFoundException('Manga not found');
    }

    await this.mangaRepository.remove(manga);
    return { message: 'Manga deleted successfully' };
  }

  // Get all chapters of a manga created by the contributor
  async getMyMangaChapters(mangaId: number, userId: number) {
    const manga = await this.mangaRepository.findOne({
      where: { id: mangaId, user: { id: userId } },
    });

    if (!manga) {
      throw new NotFoundException('Manga not found');
    }

    return this.chapterRepository.find({
      where: { manga: { id: mangaId } },
      order: { chapterNumber: 'ASC' },
    });
  }

  // Add a new chapter to a manga created by the contributor
  async addChapter(mangaId: number, chapterData: Partial<Chapter>, userId: number) {
    const manga = await this.mangaRepository.findOne({
      where: { id: mangaId, user: { id: userId } },
    });

    if (!manga) {
      throw new NotFoundException('Manga not found');
    }

    const chapter = this.chapterRepository.create({
      ...chapterData,
      manga: { id: mangaId },
    });

    return this.chapterRepository.save(chapter);
  }

  // Update a chapter of a manga created by the contributor
  async updateChapter(mangaId: number, chapterId: number, updateData: Partial<Chapter>, userId: number) {
    const manga = await this.mangaRepository.findOne({
      where: { id: mangaId, user: { id: userId } },
    });

    if (!manga) {
      throw new NotFoundException('Manga not found');
    }

    const chapter = await this.chapterRepository.findOne({
      where: { id: chapterId, manga: { id: mangaId } },
    });

    if (!chapter) {
      throw new NotFoundException('Chapter not found');
    }

    Object.assign(chapter, updateData);
    return this.chapterRepository.save(chapter);
  }

  // Delete a chapter of a manga created by the contributor
  async deleteChapter(mangaId: number, chapterId: number, userId: number) {
    const manga = await this.mangaRepository.findOne({
      where: { id: mangaId, user: { id: userId } },
    });

    if (!manga) {
      throw new NotFoundException('Manga not found');
    }

    const chapter = await this.chapterRepository.findOne({
      where: { id: chapterId, manga: { id: mangaId } },
    });

    if (!chapter) {
      throw new NotFoundException('Chapter not found');
    }

    await this.chapterRepository.remove(chapter);
    return { message: 'Chapter deleted successfully' };
  }

  // Get comments for a manga created by the contributor
  async getMangaComments(mangaId: number, userId: number) {
    const manga = await this.mangaRepository.findOne({
      where: { id: mangaId, user: { id: userId } },
    });

    if (!manga) {
      throw new NotFoundException('Manga not found');
    }

    return this.commentRepository.find({
      where: { manga: { id: mangaId } },
      relations: ['user'],
      order: { createdAt: 'DESC' },
    });
  }

  // Delete a comment from a manga created by the contributor
  async deleteComment(mangaId: number, commentId: number, userId: number) {
    const manga = await this.mangaRepository.findOne({
      where: { id: mangaId, user: { id: userId } },
    });

    if (!manga) {
      throw new NotFoundException('Manga not found');
    }

    const comment = await this.commentRepository.findOne({
      where: { id: commentId, manga: { id: mangaId } },
      relations: ['user'],
    });

    if (!comment) {
      throw new NotFoundException('Comment not found');
    }

    await this.commentRepository.remove(comment);
    return { message: 'Comment deleted successfully' };
  }

  // Add a new manga for the contributor (reuse admin logic)
  async createMyManga(createMangaDto: any, userId: number) {
    return this.mangaService.create({ ...createMangaDto, userId });
  }

  async getAllComments(userId: number) {
    // Get all manga IDs that belong to this contributor
    const mangas = await this.mangaRepository.find({
      where: { user: { id: userId } },
      select: ['id']
    });

    const mangaIds = mangas.map(manga => manga.id);

    // Get all comments for these mangas
    return this.commentRepository.find({
      where: { manga: { id: In(mangaIds) } },
      relations: ['user', 'manga'],
      order: { createdAt: 'DESC' }
    });
  }

  async uploadChapterImages(mangaId: number, chapterId: number, files: any[], userId: number) {
    const manga = await this.mangaRepository.findOne({
      where: { id: mangaId, user: { id: userId } },
    });

    if (!manga) {
      throw new NotFoundException('Manga not found');
    }

    const chapter = await this.chapterRepository.findOne({
      where: { id: chapterId, manga: { id: mangaId } },
    });

    if (!chapter) {
      throw new NotFoundException('Chapter not found');
    }

    const chapterImages = files.map((file, index) => {
      return this.chapterImageRepository.create({
        chapter: { id: chapterId },
        imageUrl: file.filename,
        order: index + 1,
      });
    });

    await this.chapterImageRepository.save(chapterImages);

    return { message: 'Images uploaded successfully', images: chapterImages };
  }
} 
import { Injectable, NotFoundException, BadRequestException, ConflictException, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User, Role } from '../users/entities/user.entity';
import { Comment } from '../comments/entities/comment.entity';
import { Manga } from '../manga/entities/manga.entity';
import { Chapter } from '../chapters/entities/chapter.entity';
import { UpdateUserDto } from './dto/update-user.dto';
import { CommentsService } from '../comments/comments.service';

@Injectable()
export class AdminPanelService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    @InjectRepository(Comment)
    private commentRepository: Repository<Comment>,
    @InjectRepository(Manga)
    private mangaRepository: Repository<Manga>,
    @InjectRepository(Chapter)
    private chapterRepository: Repository<Chapter>,
    private commentsService: CommentsService
  ) {}

  // Quản lý người dùng
  async getAllUsers(): Promise<User[]> {
    return this.usersRepository.find();
  }

  async updateUserRole(id: number, role: Role): Promise<User> {
    const user = await this.usersRepository.findOneBy({ id });

    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    user.role = role;
    return this.usersRepository.save(user);
  }

  async deleteUser(id: number): Promise<void> {
    const result = await this.usersRepository.delete(id);

    if (result.affected === 0) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
  }

  // Quản lý bình luận
  async getAllComments(page: number = 1, limit: number = 10) {
    const [comments, total] = await this.commentRepository.findAndCount({
      skip: (page - 1) * limit,
      take: limit,
      relations: ['user', 'manga'],
      order: { createdAt: 'DESC' },
    });

    return {
      comments,
      total,
      page,
      totalPages: Math.ceil(total / limit),
    };
  }

  async approveComment(commentId: number) {
    const comment = await this.commentRepository.findOne({ where: { id: commentId } });
    if (!comment) {
      throw new NotFoundException('Comment not found');
    }

    comment.isHidden = false;
    return this.commentRepository.save(comment);
  }

  async deleteComment(commentId: number) {
    const comment = await this.commentRepository.findOne({ where: { id: commentId } });
    if (!comment) {
      throw new NotFoundException('Comment not found');
    }

    await this.commentRepository.remove(comment);
    return { message: 'Comment deleted successfully' };
  }

  // Quản lý truyện và chương
  async getAllInternalManga(): Promise<Manga[]> {
    return this.mangaRepository.find({
      where: { source: 'internal' },
      relations: ['user'],
    });
  }

  async getInternalMangaById(mangaId: number): Promise<Manga> {
    const manga = await this.mangaRepository.findOne({
      where: { id: mangaId, source: 'internal' },
      relations: ['user', 'chapters'],
    });
    if (!manga) {
      throw new NotFoundException(`Internal Manga with ID ${mangaId} not found`);
    }
    return manga;
  }

  async updateInternalManga(mangaId: number, updateData: any): Promise<Manga> {
    const manga = await this.getInternalMangaById(mangaId);
    Object.assign(manga, updateData);
    return this.mangaRepository.save(manga);
  }

  async deleteInternalManga(mangaId: number): Promise<void> {
    const result = await this.mangaRepository.delete({ id: mangaId, source: 'internal' });
    if (result.affected === 0) {
      throw new NotFoundException(`Internal Manga with ID ${mangaId} not found or not internal`);
    }
  }

  async getAllInternalChapters(mangaId: number): Promise<Chapter[]> {
    return this.chapterRepository.find({
      where: { manga: { id: mangaId, source: 'internal' } },
      relations: ['manga'],
    });
  }

  async deleteInternalChapter(chapterId: number, userId: number): Promise<void> {
    const chapter = await this.chapterRepository.findOne({
      where: { id: chapterId },
      relations: ['manga'],
    });

    if (!chapter) {
      throw new NotFoundException(`Chapter with ID ${chapterId} not found`);
    }

    if (chapter.manga.source !== 'internal') {
      throw new BadRequestException('Cannot delete chapters from external sources.');
    }

    const result = await this.chapterRepository.delete(chapterId);
    if (result.affected === 0) {
      throw new NotFoundException(`Chapter with ID ${chapterId} not found`);
    }
  }
} 
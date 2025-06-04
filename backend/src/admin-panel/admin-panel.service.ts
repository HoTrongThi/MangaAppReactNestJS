import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../users/entities/user.entity';
import { Comment } from '../comments/entities/comment.entity';
import { Manga } from '../manga/entities/manga.entity';
import { Chapter } from '../chapters/entities/chapter.entity';
import { UpdateUserDto } from './dto/update-user.dto';
import { Role } from '../users/enums/role.enum';

@Injectable()
export class AdminPanelService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(Comment)
    private commentRepository: Repository<Comment>,
    @InjectRepository(Manga)
    private mangaRepository: Repository<Manga>,
    @InjectRepository(Chapter)
    private chapterRepository: Repository<Chapter>,
  ) {}

  // Quản lý người dùng
  async getAllUsers(page: number = 1, limit: number = 10) {
    const [users, total] = await this.userRepository.findAndCount({
      skip: (page - 1) * limit,
      take: limit,
      order: { created_at: 'DESC' },
    });

    return {
      users,
      total,
      page,
      totalPages: Math.ceil(total / limit),
    };
  }

  async updateUser(userId: number, updateUserDto: UpdateUserDto) {
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new NotFoundException('User not found');
    }

    // Không cho phép thay đổi role của admin khác
    if (user.role === Role.ADMIN && updateUserDto.role !== Role.ADMIN) {
      throw new Error('Cannot change role of another admin');
    }

    Object.assign(user, updateUserDto);
    return this.userRepository.save(user);
  }

  async deleteUser(userId: number) {
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new NotFoundException('User not found');
    }

    // Không cho phép xóa admin
    if (user.role === Role.ADMIN) {
      throw new Error('Cannot delete admin user');
    }

    await this.userRepository.remove(user);
    return { message: 'User deleted successfully' };
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
  async getAllUserManga(page: number = 1, limit: number = 10) {
    const [manga, total] = await this.mangaRepository.findAndCount({
      where: { source: 'internal' },
      skip: (page - 1) * limit,
      take: limit,
      relations: ['user'],
      order: { created_at: 'DESC' },
    });

    return {
      manga,
      total,
      page,
      totalPages: Math.ceil(total / limit),
    };
  }

  async deleteManga(mangaId: number) {
    const manga = await this.mangaRepository.findOne({
      where: { id: mangaId, source: 'internal' },
    });
    if (!manga) {
      throw new NotFoundException('Manga not found');
    }

    await this.mangaRepository.remove(manga);
    return { message: 'Manga deleted successfully' };
  }

  async deleteChapter(chapterId: number) {
    const chapter = await this.chapterRepository.findOne({
      where: { id: chapterId },
      relations: ['manga'],
    });
    if (!chapter) {
      throw new NotFoundException('Chapter not found');
    }

    if (chapter.manga.source !== 'internal') {
      throw new Error('Cannot delete chapter of non-internal manga');
    }

    await this.chapterRepository.remove(chapter);
    return { message: 'Chapter deleted successfully' };
  }
} 
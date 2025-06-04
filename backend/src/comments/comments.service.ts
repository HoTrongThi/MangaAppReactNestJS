import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Comment } from './entities/comment.entity';
import { CreateCommentDto } from './dto/create-comment.dto';
import { Manga } from '../manga/entities/manga.entity';
import { User } from '../users/entities/user.entity';

@Injectable()
export class CommentsService {
  constructor(
    @InjectRepository(Comment)
    private commentRepository: Repository<Comment>,
    @InjectRepository(Manga)
    private mangaRepository: Repository<Manga>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async create(mangaId: number, createCommentDto: CreateCommentDto, userId: number): Promise<Comment> {
    const manga = await this.mangaRepository.findOne({ where: { id: mangaId } });
    if (!manga) {
      throw new NotFoundException('Manga not found');
    }

    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new NotFoundException('User not found');
    }

    const comment = this.commentRepository.create({
      ...createCommentDto,
      manga,
      user,
    });

    return this.commentRepository.save(comment);
  }

  async findAllByManga(mangaId: number): Promise<Comment[]> {
    return this.commentRepository.find({
      where: { manga: { id: mangaId } },
      relations: ['user'],
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(id: number): Promise<Comment> {
    const comment = await this.commentRepository.findOne({
      where: { id },
      relations: ['user', 'manga'],
    });

    if (!comment) {
      throw new NotFoundException('Comment not found');
    }

    return comment;
  }

  async toggleHidden(id: number): Promise<Comment> {
    const comment = await this.findOne(id);
    comment.isHidden = !comment.isHidden;
    return this.commentRepository.save(comment);
  }

  async remove(id: number, userId: number): Promise<void> {
    const comment = await this.findOne(id);
    
    // Check if user is the comment owner or an admin
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new NotFoundException('User not found');
    }

    if (comment.user.id !== userId && user.role !== 'admin') {
      throw new UnauthorizedException('You can only delete your own comments');
    }

    await this.commentRepository.remove(comment);
  }
} 
import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Rating } from './entities/rating.entity';
import { CreateRatingDto } from './dto/create-rating.dto';
import { User } from '../users/entities/user.entity';
import { Manga } from '../manga/entities/manga.entity';

@Injectable()
export class RatingsService {
  constructor(
    @InjectRepository(Rating)
    private ratingRepository: Repository<Rating>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(Manga)
    private mangaRepository: Repository<Manga>,
  ) {}

  async create(userId: number, mangaId: number, createRatingDto: CreateRatingDto): Promise<Rating> {
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new NotFoundException('User not found');
    }

    const manga = await this.mangaRepository.findOne({ where: { id: mangaId } });
    if (!manga) {
      throw new NotFoundException('Manga not found');
    }

    // Check if user has already rated this manga
    let history = await this.ratingRepository.findOne({
      where: {
        user: { id: userId },
        manga: { id: mangaId },
      },
    });

    if (history) {
      // Update existing history
      history.score = createRatingDto.score;
      if (createRatingDto.comment !== undefined) {
        history.comment = createRatingDto.comment;
      }
      return this.ratingRepository.save(history);
    }

    // Create new history
    history = this.ratingRepository.create({
      user,
      manga,
      score: createRatingDto.score,
      comment: createRatingDto.comment || null,
    });

    return this.ratingRepository.save(history);
  }

  async findAll(mangaId: number): Promise<Rating[]> {
    return this.ratingRepository.find({
      where: { manga: { id: mangaId } },
      relations: ['user'],
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(userId: number, mangaId: number): Promise<Rating> {
    const history = await this.ratingRepository.findOne({
      where: {
        user: { id: userId },
        manga: { id: mangaId },
      },
    });

    if (!history) {
      throw new NotFoundException('Rating not found');
    }

    return history;
  }

  async getAverageRating(mangaId: number): Promise<{ average: number; count: number }> {
    const result = await this.ratingRepository
      .createQueryBuilder('rating')
      .select('AVG(rating.score)', 'average')
      .addSelect('COUNT(rating.id)', 'count')
      .where('rating.manga.id = :mangaId', { mangaId })
      .getRawOne();

    return {
      average: parseFloat(result.average) || 0,
      count: parseInt(result.count) || 0,
    };
  }

  async remove(userId: number, mangaId: number): Promise<void> {
    const result = await this.ratingRepository.delete({
      user: { id: userId },
      manga: { id: mangaId },
    });

    if (result.affected === 0) {
      throw new NotFoundException('Rating not found');
    }
  }
} 
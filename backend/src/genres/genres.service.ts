import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Genre } from './entities/genre.entity';

@Injectable()
export class GenresService {
  constructor(
    @InjectRepository(Genre) // Inject Genre Repository
    private genresRepository: Repository<Genre>,
  ) {}

  async findAll(): Promise<Genre[]> {
    return this.genresRepository.find(); // Find all genres
  }

  // Add other methods here later if needed (e.g., find by ID, create, update, delete - likely admin only)
} 
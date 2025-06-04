import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RatingsService } from './ratings.service';
import { Rating } from './entities/rating.entity';
import { User } from '../users/entities/user.entity';
import { Manga } from '../manga/entities/manga.entity';
import { CreateRatingDto } from './dto/create-rating.dto';
import { NotFoundException } from '@nestjs/common';

describe('RatingsService', () => {
  let service: RatingsService;
  let ratingRepository: Repository<Rating>;
  let userRepository: Repository<User>;
  let mangaRepository: Repository<Manga>;

  const mockUser = {
    id: 1,
    username: 'testuser',
    email: 'test@example.com',
    role: 'user',
  };

  const mockManga = {
    id: 1,
    title: 'Test Manga',
    description: 'Test Description',
    mangaDexId: 'test-manga-123',
    coverFileName: 'cover.jpg',
    author: 'Test Author',
    artist: 'Test Artist',
    status: 'ongoing',
    type: 'manga',
    source: 'mangadex',
    source_id: '123',
    metadata: {},
    created_at: new Date(),
    updated_at: new Date(),
    genres: [],
    chapters: [],
    bookmarks: [],
    histories: [],
    ratings: [],
    comments: []
  };

  const mockRating = {
    id: 1,
    score: 5,
    comment: 'Great manga!',
    user: mockUser,
    manga: mockManga,
    createdAt: new Date(),
    updatedAt: new Date()
  };

  const mockRatingRepository = {
    create: jest.fn(),
    save: jest.fn(),
    find: jest.fn(),
    findOne: jest.fn(),
    delete: jest.fn(),
    createQueryBuilder: jest.fn(() => ({
      select: jest.fn().mockReturnThis(),
      addSelect: jest.fn().mockReturnThis(),
      where: jest.fn().mockReturnThis(),
      getRawOne: jest.fn(),
    })),
  };

  const mockUserRepository = {
    findOne: jest.fn(),
  };

  const mockMangaRepository = {
    findOne: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RatingsService,
        {
          provide: getRepositoryToken(Rating),
          useValue: mockRatingRepository,
        },
        {
          provide: getRepositoryToken(User),
          useValue: mockUserRepository,
        },
        {
          provide: getRepositoryToken(Manga),
          useValue: mockMangaRepository,
        },
      ],
    }).compile();

    service = module.get<RatingsService>(RatingsService);
    ratingRepository = module.get<Repository<Rating>>(getRepositoryToken(Rating));
    userRepository = module.get<Repository<User>>(getRepositoryToken(User));
    mangaRepository = module.get<Repository<Manga>>(getRepositoryToken(Manga));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    const createRatingDto: CreateRatingDto = {
      score: 5,
      comment: 'Great manga!'
    };

    it('should create a new rating', async () => {
      mockUserRepository.findOne.mockResolvedValue(mockUser);
      mockMangaRepository.findOne.mockResolvedValue(mockManga);
      mockRatingRepository.findOne.mockResolvedValue(null);
      mockRatingRepository.create.mockReturnValue(mockRating);
      mockRatingRepository.save.mockResolvedValue(mockRating);

      const result = await service.create(1, 1, createRatingDto);
      expect(result).toEqual(mockRating);
      expect(mockUserRepository.findOne).toHaveBeenCalledWith({ where: { id: 1 } });
      expect(mockMangaRepository.findOne).toHaveBeenCalledWith({ where: { id: 1 } });
      expect(mockRatingRepository.create).toHaveBeenCalledWith({
        user: mockUser,
        manga: mockManga,
        score: createRatingDto.score,
        comment: createRatingDto.comment,
      });
    });

    it('should update existing rating', async () => {
      mockUserRepository.findOne.mockResolvedValue(mockUser);
      mockMangaRepository.findOne.mockResolvedValue(mockManga);
      mockRatingRepository.findOne.mockResolvedValue(mockRating);
      mockRatingRepository.save.mockResolvedValue({
        ...mockRating,
        score: 4,
      });

      const result = await service.create(1, 1, { score: 4 });
      expect(result.score).toBe(4);
      expect(mockRatingRepository.save).toHaveBeenCalled();
    });

    it('should throw NotFoundException if user not found', async () => {
      mockUserRepository.findOne.mockResolvedValue(null);

      await expect(service.create(1, 1, createRatingDto)).rejects.toThrow(NotFoundException);
    });

    it('should throw NotFoundException if manga not found', async () => {
      mockUserRepository.findOne.mockResolvedValue(mockUser);
      mockMangaRepository.findOne.mockResolvedValue(null);

      await expect(service.create(1, 1, createRatingDto)).rejects.toThrow(NotFoundException);
    });
  });

  describe('findAll', () => {
    it('should return an array of ratings for a manga', async () => {
      mockRatingRepository.find.mockResolvedValue([mockRating]);

      const result = await service.findAll(1);
      expect(result).toEqual([mockRating]);
      expect(mockRatingRepository.find).toHaveBeenCalledWith({
        where: { manga: { id: 1 } },
        relations: ['user'],
        order: { createdAt: 'DESC' },
      });
    });
  });

  describe('findOne', () => {
    it('should return a rating by user and manga', async () => {
      mockRatingRepository.findOne.mockResolvedValue(mockRating);

      const result = await service.findOne(1, 1);
      expect(result).toEqual(mockRating);
      expect(mockRatingRepository.findOne).toHaveBeenCalledWith({
        where: {
          user: { id: 1 },
          manga: { id: 1 },
        },
      });
    });

    it('should throw NotFoundException if rating not found', async () => {
      mockRatingRepository.findOne.mockResolvedValue(null);

      await expect(service.findOne(1, 1)).rejects.toThrow(NotFoundException);
    });
  });

  describe('getAverageRating', () => {
    it('should return average rating and count', async () => {
      const mockQueryBuilder = {
        select: jest.fn().mockReturnThis(),
        addSelect: jest.fn().mockReturnThis(),
        where: jest.fn().mockReturnThis(),
        getRawOne: jest.fn().mockResolvedValue({ average: '4.5', count: '10' }),
      };
      mockRatingRepository.createQueryBuilder.mockReturnValue(mockQueryBuilder);

      const result = await service.getAverageRating(1);
      expect(result).toEqual({ average: 4.5, count: 10 });
    });

    it('should return 0 for average and count if no ratings', async () => {
      const mockQueryBuilder = {
        select: jest.fn().mockReturnThis(),
        addSelect: jest.fn().mockReturnThis(),
        where: jest.fn().mockReturnThis(),
        getRawOne: jest.fn().mockResolvedValue({ average: null, count: '0' }),
      };
      mockRatingRepository.createQueryBuilder.mockReturnValue(mockQueryBuilder);

      const result = await service.getAverageRating(1);
      expect(result).toEqual({ average: 0, count: 0 });
    });
  });

  describe('remove', () => {
    it('should remove a rating', async () => {
      mockRatingRepository.delete.mockResolvedValue({ affected: 1 });

      await service.remove(1, 1);
      expect(mockRatingRepository.delete).toHaveBeenCalledWith({
        user: { id: 1 },
        manga: { id: 1 },
      });
    });

    it('should throw NotFoundException if rating not found', async () => {
      mockRatingRepository.delete.mockResolvedValue({ affected: 0 });

      await expect(service.remove(1, 1)).rejects.toThrow(NotFoundException);
    });
  });
}); 
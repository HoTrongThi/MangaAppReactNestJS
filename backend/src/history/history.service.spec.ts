import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { HistoryService } from './history.service';
import { History } from './entities/history.entity';
import { User } from '../users/entities/user.entity';
import { Manga } from '../manga/entities/manga.entity';
import { CreateHistoryDto } from './dto/create-history.dto';
import { NotFoundException } from '@nestjs/common';

describe('HistoryService', () => {
  let service: HistoryService;
  let historyRepository: Repository<History>;
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

  const mockHistory = {
    id: 1,
    chapterNumber: 1,
    pageNumber: 1,
    user: mockUser,
    manga: mockManga,
    createdAt: new Date(),
    updatedAt: new Date()
  };

  const mockHistoryRepository = {
    create: jest.fn(),
    save: jest.fn(),
    find: jest.fn(),
    findOne: jest.fn(),
    delete: jest.fn(),
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
        HistoryService,
        {
          provide: getRepositoryToken(History),
          useValue: mockHistoryRepository,
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

    service = module.get<HistoryService>(HistoryService);
    historyRepository = module.get<Repository<History>>(getRepositoryToken(History));
    userRepository = module.get<Repository<User>>(getRepositoryToken(User));
    mangaRepository = module.get<Repository<Manga>>(getRepositoryToken(Manga));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    const createHistoryDto: CreateHistoryDto = {
      mangaId: 1,
      chapterNumber: 1,
      pageNumber: 1
    };

    it('should create a new history', async () => {
      mockUserRepository.findOne.mockResolvedValue(mockUser);
      mockMangaRepository.findOne.mockResolvedValue(mockManga);
      mockHistoryRepository.findOne.mockResolvedValue(null);
      mockHistoryRepository.create.mockReturnValue(mockHistory);
      mockHistoryRepository.save.mockResolvedValue(mockHistory);

      const result = await service.create(1, createHistoryDto);
      expect(result).toEqual(mockHistory);
      expect(mockUserRepository.findOne).toHaveBeenCalledWith({ where: { id: 1 } });
      expect(mockMangaRepository.findOne).toHaveBeenCalledWith({ where: { id: 1 } });
      expect(mockHistoryRepository.create).toHaveBeenCalledWith({
        user: mockUser,
        manga: mockManga,
        chapterNumber: createHistoryDto.chapterNumber,
        pageNumber: createHistoryDto.pageNumber,
      });
    });

    it('should update existing history', async () => {
      mockUserRepository.findOne.mockResolvedValue(mockUser);
      mockMangaRepository.findOne.mockResolvedValue(mockManga);
      mockHistoryRepository.findOne.mockResolvedValue(mockHistory);
      mockHistoryRepository.save.mockResolvedValue({
        ...mockHistory,
        chapterNumber: 2,
        pageNumber: 2,
      });

      const result = await service.create(1, { mangaId: 1, chapterNumber: 2, pageNumber: 2 });
      expect(result.chapterNumber).toBe(2);
      expect(result.pageNumber).toBe(2);
      expect(mockHistoryRepository.save).toHaveBeenCalled();
    });

    it('should throw NotFoundException if user not found', async () => {
      mockUserRepository.findOne.mockResolvedValue(null);

      await expect(service.create(1, createHistoryDto)).rejects.toThrow(NotFoundException);
    });

    it('should throw NotFoundException if manga not found', async () => {
      mockUserRepository.findOne.mockResolvedValue(mockUser);
      mockMangaRepository.findOne.mockResolvedValue(null);

      await expect(service.create(1, createHistoryDto)).rejects.toThrow(NotFoundException);
    });
  });

  describe('findAll', () => {
    it('should return an array of histories for a user', async () => {
      mockHistoryRepository.find.mockResolvedValue([mockHistory]);

      const result = await service.findAll(1);
      expect(result).toEqual([mockHistory]);
      expect(mockHistoryRepository.find).toHaveBeenCalledWith({
        where: { user: { id: 1 } },
        relations: ['manga'],
        order: { updatedAt: 'DESC' },
      });
    });
  });

  describe('findOne', () => {
    it('should return a history by user and manga', async () => {
      mockHistoryRepository.findOne.mockResolvedValue(mockHistory);

      const result = await service.findOne(1, 1);
      expect(result).toEqual(mockHistory);
      expect(mockHistoryRepository.findOne).toHaveBeenCalledWith({
        where: {
          user: { id: 1 },
          manga: { id: 1 },
        },
        relations: ['manga'],
      });
    });

    it('should throw NotFoundException if history not found', async () => {
      mockHistoryRepository.findOne.mockResolvedValue(null);

      await expect(service.findOne(1, 1)).rejects.toThrow(NotFoundException);
    });
  });

  describe('remove', () => {
    it('should remove a history', async () => {
      mockHistoryRepository.delete.mockResolvedValue({ affected: 1 });

      await service.remove(1, 1);
      expect(mockHistoryRepository.delete).toHaveBeenCalledWith({
        user: { id: 1 },
        manga: { id: 1 },
      });
    });

    it('should throw NotFoundException if history not found', async () => {
      mockHistoryRepository.delete.mockResolvedValue({ affected: 0 });

      await expect(service.remove(1, 1)).rejects.toThrow(NotFoundException);
    });
  });
}); 
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { ViewsService } from './views.service';
import { View } from './entities/view.entity';
import { Chapter } from '../chapters/entities/chapter.entity';
import { User } from '../users/entities/user.entity';
import { CreateViewDto } from './dto/create-view.dto';
import { NotFoundException } from '@nestjs/common';
import { Role } from '../users/entities/role.enum';
import { Manga } from '../manga/entities/manga.entity';

describe('ViewsService', () => {
  let service: ViewsService;
  let viewRepository: any;
  let chapterRepository: any;
  let userRepository: any;

  const mockUser: Partial<User> = {
    id: 1,
    role: Role.USER,
  };

  const mockManga: Partial<Manga> = {
    id: 1,
    title: 'Manga 1',
    source: 'internal',
    mangaDexId: 'test-manga-1',
    description: 'Test Description',
    coverFileName: 'test-cover.jpg',
    author: 'Test Author',
    artist: 'Test Artist',
    status: 'ongoing',
    type: 'manga',
    genres: [],
    created_at: new Date(),
    updated_at: new Date(),
  };

  const mockChapter: Partial<Chapter> = {
    id: 1,
    title: 'Chapter 1',
    chapterNumber: 1,
    manga: mockManga as Manga,
  };

  const mockView: Partial<View> = {
    id: 1,
    chapter: mockChapter as Chapter,
    user: mockUser as User,
    ip_address: '127.0.0.1',
    user_agent: 'test-agent',
    created_at: new Date(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ViewsService,
        {
          provide: getRepositoryToken(View),
          useValue: {
            create: jest.fn(),
            save: jest.fn(),
            count: jest.fn(),
            createQueryBuilder: jest.fn(() => ({
              select: jest.fn().mockReturnThis(),
              addSelect: jest.fn().mockReturnThis(),
              innerJoin: jest.fn().mockReturnThis(),
              where: jest.fn().mockReturnThis(),
              groupBy: jest.fn().mockReturnThis(),
              orderBy: jest.fn().mockReturnThis(),
              limit: jest.fn().mockReturnThis(),
              getRawMany: jest.fn().mockResolvedValue([
                { chapterId: 1, title: 'Chapter 1', chapterNumber: 1, viewCount: 100 },
                { chapterId: 2, title: 'Chapter 2', chapterNumber: 2, viewCount: 50 },
              ]),
            })),
          },
        },
        {
          provide: getRepositoryToken(Chapter),
          useValue: {
            findOne: jest.fn(),
          },
        },
        {
          provide: getRepositoryToken(User),
          useValue: {
            findOne: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<ViewsService>(ViewsService);
    viewRepository = module.get(getRepositoryToken(View));
    chapterRepository = module.get(getRepositoryToken(Chapter));
    userRepository = module.get(getRepositoryToken(User));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a new view', async () => {
      const createViewDto: CreateViewDto = {
        chapterId: 1,
        ip_address: '127.0.0.1',
        user_agent: 'test-agent',
      };

      chapterRepository.findOne.mockResolvedValue(mockChapter);
      userRepository.findOne.mockResolvedValue(mockUser);
      viewRepository.create.mockReturnValue(mockView);
      viewRepository.save.mockResolvedValue(mockView);

      const result = await service.create(createViewDto, 1);
      expect(result).toEqual(mockView);
    });

    it('should throw NotFoundException when chapter not found', async () => {
      const createViewDto: CreateViewDto = {
        chapterId: 1,
      };

      chapterRepository.findOne.mockResolvedValue(null);

      await expect(service.create(createViewDto, 1)).rejects.toThrow(NotFoundException);
    });

    it('should throw NotFoundException when user not found', async () => {
      const createViewDto: CreateViewDto = {
        chapterId: 1,
      };

      chapterRepository.findOne.mockResolvedValue(mockChapter);
      userRepository.findOne.mockResolvedValue(null);

      await expect(service.create(createViewDto, 1)).rejects.toThrow(NotFoundException);
    });

    it('should throw error when manga is not internal', async () => {
      const createViewDto: CreateViewDto = {
        chapterId: 1,
      };

      const externalChapter = {
        ...mockChapter,
        manga: { ...mockManga, source: 'external' } as Manga,
      };

      chapterRepository.findOne.mockResolvedValue(externalChapter);
      userRepository.findOne.mockResolvedValue(mockUser);

      await expect(service.create(createViewDto, 1)).rejects.toThrow('Views can only be recorded for internal manga');
    });
  });

  describe('getChapterViews', () => {
    it('should return chapter views count', async () => {
      const expectedCount = 100;
      viewRepository.count.mockResolvedValue(expectedCount);

      const result = await service.getChapterViews(1);
      expect(result).toEqual(expectedCount);
    });
  });

  describe('getMangaViews', () => {
    it('should return manga views count', async () => {
      const expectedCount = 1000;
      viewRepository.count.mockResolvedValue(expectedCount);

      const result = await service.getMangaViews(1);
      expect(result).toEqual(expectedCount);
    });
  });

  describe('getTopViewedChapters', () => {
    it('should return top viewed chapters', async () => {
      const mockQueryBuilder = {
        select: jest.fn().mockReturnThis(),
        addSelect: jest.fn().mockReturnThis(),
        innerJoin: jest.fn().mockReturnThis(),
        where: jest.fn().mockReturnThis(),
        groupBy: jest.fn().mockReturnThis(),
        orderBy: jest.fn().mockReturnThis(),
        limit: jest.fn().mockReturnThis(),
        getRawMany: jest.fn().mockResolvedValue([
          { chapterId: 1, title: 'Chapter 1', chapterNumber: 1, viewCount: 100 },
          { chapterId: 2, title: 'Chapter 2', chapterNumber: 2, viewCount: 50 },
        ]),
      };

      viewRepository.createQueryBuilder.mockReturnValue(mockQueryBuilder);

      const result = await service.getTopViewedChapters(10);
      expect(result).toHaveLength(2);
      expect(result[0].chapterId).toBe(1);
      expect(result[1].chapterId).toBe(2);
    });

    it('should return top viewed chapters with limit', async () => {
      const mockQueryBuilder = {
        select: jest.fn().mockReturnThis(),
        addSelect: jest.fn().mockReturnThis(),
        innerJoin: jest.fn().mockReturnThis(),
        where: jest.fn().mockReturnThis(),
        groupBy: jest.fn().mockReturnThis(),
        orderBy: jest.fn().mockReturnThis(),
        limit: jest.fn().mockReturnThis(),
        getRawMany: jest.fn().mockResolvedValue([
          { chapterId: 1, title: 'Chapter 1', chapterNumber: 1, viewCount: 100 },
        ]),
      };

      viewRepository.createQueryBuilder.mockReturnValue(mockQueryBuilder);

      const result = await service.getTopViewedChapters(1);
      expect(result).toHaveLength(1);
      expect(result[0].chapterId).toBe(1);
    });
  });

  describe('getTopViewedManga', () => {
    it('should return top viewed manga', async () => {
      const mockQueryBuilder = {
        select: jest.fn().mockReturnThis(),
        addSelect: jest.fn().mockReturnThis(),
        innerJoin: jest.fn().mockReturnThis(),
        where: jest.fn().mockReturnThis(),
        groupBy: jest.fn().mockReturnThis(),
        orderBy: jest.fn().mockReturnThis(),
        limit: jest.fn().mockReturnThis(),
        getRawMany: jest.fn().mockResolvedValue([
          { mangaId: 1, title: 'Manga 1', viewCount: 200 },
          { mangaId: 2, title: 'Manga 2', viewCount: 150 },
        ]),
      };

      viewRepository.createQueryBuilder.mockReturnValue(mockQueryBuilder);

      const result = await service.getTopViewedManga(10);
      expect(result).toHaveLength(2);
      expect(result[0].mangaId).toBe(1);
      expect(result[1].mangaId).toBe(2);
    });

    it('should return top viewed manga with limit', async () => {
      const mockQueryBuilder = {
        select: jest.fn().mockReturnThis(),
        addSelect: jest.fn().mockReturnThis(),
        innerJoin: jest.fn().mockReturnThis(),
        where: jest.fn().mockReturnThis(),
        groupBy: jest.fn().mockReturnThis(),
        orderBy: jest.fn().mockReturnThis(),
        limit: jest.fn().mockReturnThis(),
        getRawMany: jest.fn().mockResolvedValue([
          { mangaId: 1, title: 'Manga 1', viewCount: 200 },
        ]),
      };

      viewRepository.createQueryBuilder.mockReturnValue(mockQueryBuilder);

      const result = await service.getTopViewedManga(1);
      expect(result).toHaveLength(1);
      expect(result[0].mangaId).toBe(1);
    });
  });
}); 
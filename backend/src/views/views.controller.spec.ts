import { Test, TestingModule } from '@nestjs/testing';
import { ViewsController } from './views.controller';
import { ViewsService } from './views.service';
import { CreateViewDto } from './dto/create-view.dto';
import { Role } from '../users/entities/role.enum';
import { View } from './entities/view.entity';
import { User } from '../users/entities/user.entity';
import { Chapter } from '../chapters/entities/chapter.entity';

describe('ViewsController', () => {
  let controller: ViewsController;
  let viewsService: ViewsService;

  const mockUser: Partial<User> = {
    id: 1,
    role: Role.USER,
  };

  const mockChapter: Partial<Chapter> = {
    id: 1,
    title: 'Chapter 1',
    chapterNumber: 1,
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
      controllers: [ViewsController],
      providers: [
        {
          provide: ViewsService,
          useValue: {
            create: jest.fn(),
            getChapterViews: jest.fn(),
            getMangaViews: jest.fn(),
            getTopViewedChapters: jest.fn(),
            getTopViewedManga: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<ViewsController>(ViewsController);
    viewsService = module.get<ViewsService>(ViewsService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should create a new view', async () => {
      const createViewDto: CreateViewDto = {
        chapterId: 1,
        ip_address: '127.0.0.1',
        user_agent: 'test-agent',
      };

      jest.spyOn(viewsService, 'create').mockResolvedValue(mockView as View);

      const result = await controller.create(createViewDto, { user: mockUser });
      expect(result).toEqual(mockView);
    });
  });

  describe('getChapterViews', () => {
    it('should return chapter views', async () => {
      const chapterId = '1';
      const expectedViews = 100;

      jest.spyOn(viewsService, 'getChapterViews').mockResolvedValue(expectedViews);

      const result = await controller.getChapterViews(chapterId);
      expect(result).toEqual(expectedViews);
    });
  });

  describe('getMangaViews', () => {
    it('should return manga views', async () => {
      const mangaId = '1';
      const expectedViews = 1000;

      jest.spyOn(viewsService, 'getMangaViews').mockResolvedValue(expectedViews);

      const result = await controller.getMangaViews(mangaId);
      expect(result).toEqual(expectedViews);
    });
  });

  describe('getTopViewedChapters', () => {
    it('should return top chapters', async () => {
      const mangaId = '1';
      const expectedChapters = [
        { chapterId: 1, title: 'Chapter 1', chapterNumber: 1, viewCount: 100 },
        { chapterId: 2, title: 'Chapter 2', chapterNumber: 2, viewCount: 50 },
      ];

      jest.spyOn(viewsService, 'getTopViewedChapters').mockResolvedValue(expectedChapters);

      const result = await controller.getTopViewedChapters(mangaId);
      expect(result).toEqual(expectedChapters);
    });

    it('should return top chapters with limit', async () => {
      const mangaId = '1';
      const limit = '5';
      const expectedChapters = [
        { chapterId: 1, title: 'Chapter 1', chapterNumber: 1, viewCount: 100 },
        { chapterId: 2, title: 'Chapter 2', chapterNumber: 2, viewCount: 50 },
      ];

      jest.spyOn(viewsService, 'getTopViewedChapters').mockResolvedValue(expectedChapters);

      const result = await controller.getTopViewedChapters(mangaId, limit);
      expect(result).toEqual(expectedChapters);
    });
  });

  describe('getTopViewedManga', () => {
    it('should return top manga', async () => {
      const expectedManga = [
        { mangaId: 1, title: 'Manga 1', viewCount: 1000 },
        { mangaId: 2, title: 'Manga 2', viewCount: 500 },
      ];

      jest.spyOn(viewsService, 'getTopViewedManga').mockResolvedValue(expectedManga);

      const result = await controller.getTopViewedManga();
      expect(result).toEqual(expectedManga);
    });

    it('should return top manga with limit', async () => {
      const limit = '5';
      const expectedManga = [
        { mangaId: 1, title: 'Manga 1', viewCount: 1000 },
        { mangaId: 2, title: 'Manga 2', viewCount: 500 },
      ];

      jest.spyOn(viewsService, 'getTopViewedManga').mockResolvedValue(expectedManga);

      const result = await controller.getTopViewedManga(limit);
      expect(result).toEqual(expectedManga);
    });
  });
}); 
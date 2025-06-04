import { Test, TestingModule } from '@nestjs/testing';
import { BookmarksService } from './bookmarks.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Bookmark } from './entities/bookmark.entity';
import { User } from '../users/entities/user.entity';
import { Manga } from '../manga/entities/manga.entity';
import { Role } from '../users/entities/role.enum';

describe('BookmarksService', () => {
  let service: BookmarksService;
  let bookmarkRepository: any;
  let userRepository: any;
  let mangaRepository: any;

  const mockUser: Partial<User> = {
    id: 1,
    username: 'testuser',
    email: 'test@example.com',
    role: Role.USER,
  };

  const mockManga: Partial<Manga> = {
    id: 1,
    title: 'Test Manga',
  };

  const mockBookmark: Partial<Bookmark> = {
    id: 1,
    user: mockUser as User,
    manga: mockManga as Manga,
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BookmarksService,
        {
          provide: getRepositoryToken(Bookmark),
          useValue: {
            find: jest.fn(),
            findOne: jest.fn(),
            create: jest.fn(),
            save: jest.fn(),
            delete: jest.fn(),
          },
        },
        {
          provide: getRepositoryToken(User),
          useValue: {
            findOne: jest.fn(),
          },
        },
        {
          provide: getRepositoryToken(Manga),
          useValue: {
            findOne: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<BookmarksService>(BookmarksService);
    bookmarkRepository = module.get(getRepositoryToken(Bookmark));
    userRepository = module.get(getRepositoryToken(User));
    mangaRepository = module.get(getRepositoryToken(Manga));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a bookmark', async () => {
      userRepository.findOne.mockResolvedValue(mockUser);
      mangaRepository.findOne.mockResolvedValue(mockManga);
      bookmarkRepository.create.mockReturnValue(mockBookmark);
      bookmarkRepository.save.mockResolvedValue(mockBookmark);

      const result = await service.create(1, 1);
      expect(result).toEqual(mockBookmark);
    });
  });

  describe('findAllForUser', () => {
    it('should return an array of bookmarks', async () => {
      bookmarkRepository.find.mockResolvedValue([mockBookmark]);

      const result = await service.findAllForUser(1);
      expect(result).toEqual([mockBookmark]);
    });
  });

  describe('remove', () => {
    it('should remove a bookmark', async () => {
      bookmarkRepository.delete.mockResolvedValue({ affected: 1 });

      await service.remove(1, 1);
      expect(bookmarkRepository.delete).toHaveBeenCalledWith({
        user: { id: 1 },
        manga: { id: 1 },
      });
    });

    it('should throw error when bookmark not found', async () => {
      bookmarkRepository.delete.mockResolvedValue({ affected: 0 });

      await expect(service.remove(1, 1)).rejects.toThrow('Bookmark not found');
    });
  });
}); 
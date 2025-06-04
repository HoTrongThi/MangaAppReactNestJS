import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { AdminPanelService } from './admin-panel.service';
import { User } from '../users/entities/user.entity';
import { Comment } from '../comments/entities/comment.entity';
import { Manga } from '../manga/entities/manga.entity';
import { Chapter } from '../chapters/entities/chapter.entity';
import { UpdateUserDto } from './dto/update-user.dto';
import { Role } from '../users/entities/role.enum';
import { NotFoundException } from '@nestjs/common';

describe('AdminPanelService', () => {
  let service: AdminPanelService;
  let userRepository: any;
  let commentRepository: any;
  let mangaRepository: any;
  let chapterRepository: any;

  const mockUser: User = {
    id: 1,
    username: 'testuser',
    email: 'test@example.com',
    role: Role.USER,
    password: 'hashed_password',
    is_active: true,
    created_at: new Date(),
    updated_at: new Date(),
    comments: [],
    ratings: [],
    bookmarks: [],
    histories: [],
  };

  const mockComment: Comment = {
    id: 1,
    content: 'Test comment',
    isHidden: false,
    user: mockUser,
    manga: null,
    parent: null,
    replies: [],
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const mockManga: Manga = {
    id: 1,
    title: 'Test Manga',
    description: 'Test Description',
    author: 'Test Author',
    artist: 'Test Artist',
    status: 'ongoing',
    type: 'manga',
    genres: [],
    mangaDexId: 'test-manga-1',
    coverFileName: 'test-cover.jpg',
    source: 'internal',
    source_id: '123',
    created_at: new Date(),
    updated_at: new Date(),
    chapters: [],
    comments: [],
    ratings: [],
    bookmarks: [],
    metadata: {},
    histories: [],
  };

  const mockChapter: Chapter = {
    id: 1,
    title: 'Chapter 1',
    chapterNumber: 1,
    volumeNumber: '1',
    pages: [],
    source: 'internal',
    source_id: '123',
    metadata: {},
    manga: mockManga,
    created_at: new Date(),
    updated_at: new Date(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AdminPanelService,
        {
          provide: getRepositoryToken(User),
          useValue: {
            findAndCount: jest.fn(),
            findOne: jest.fn(),
            save: jest.fn(),
            remove: jest.fn(),
          },
        },
        {
          provide: getRepositoryToken(Comment),
          useValue: {
            findAndCount: jest.fn(),
            findOne: jest.fn(),
            save: jest.fn(),
            remove: jest.fn(),
          },
        },
        {
          provide: getRepositoryToken(Manga),
          useValue: {
            findAndCount: jest.fn(),
            findOne: jest.fn(),
            remove: jest.fn(),
          },
        },
        {
          provide: getRepositoryToken(Chapter),
          useValue: {
            findOne: jest.fn(),
            remove: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<AdminPanelService>(AdminPanelService);
    userRepository = module.get(getRepositoryToken(User));
    commentRepository = module.get(getRepositoryToken(Comment));
    mangaRepository = module.get(getRepositoryToken(Manga));
    chapterRepository = module.get(getRepositoryToken(Chapter));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getAllUsers', () => {
    it('should return paginated users', async () => {
      const expectedResponse = {
        users: [mockUser],
        total: 1,
        page: 1,
        totalPages: 1,
      };

      userRepository.findAndCount.mockResolvedValue([[mockUser], 1]);

      const result = await service.getAllUsers(1, 10);
      expect(result).toEqual(expectedResponse);
    });
  });

  describe('updateUser', () => {
    it('should update a user', async () => {
      const updateUserDto: UpdateUserDto = {
        role: Role.ADMIN,
      };

      userRepository.findOne.mockResolvedValue(mockUser);
      userRepository.save.mockResolvedValue({ ...mockUser, ...updateUserDto });

      const result = await service.updateUser(1, updateUserDto);
      expect(result).toEqual({ ...mockUser, ...updateUserDto });
    });

    it('should throw NotFoundException when user not found', async () => {
      const updateUserDto: UpdateUserDto = {
        role: Role.ADMIN,
      };

      userRepository.findOne.mockResolvedValue(null);

      await expect(service.updateUser(1, updateUserDto)).rejects.toThrow(NotFoundException);
    });

    it('should throw error when trying to change admin role', async () => {
      const updateUserDto: UpdateUserDto = {
        role: Role.USER,
      };

      const adminUser = { ...mockUser, role: Role.ADMIN };
      userRepository.findOne.mockResolvedValue(adminUser);

      await expect(service.updateUser(1, updateUserDto)).rejects.toThrow('Cannot change role of another admin');
    });
  });

  describe('deleteUser', () => {
    it('should delete a user', async () => {
      const mockUser = {
        id: 1,
        username: 'testuser',
        email: 'test@example.com',
        role: Role.USER,
        password: 'hashed_password',
        is_active: true,
        created_at: new Date(),
        updated_at: new Date(),
        comments: [],
        ratings: [],
        bookmarks: [],
        histories: [],
      };

      userRepository.findOne.mockResolvedValue(mockUser);
      userRepository.remove.mockResolvedValue(mockUser);

      await service.deleteUser(1);
      expect(userRepository.remove).toHaveBeenCalledWith(mockUser);
    });

    it('should throw error when trying to delete admin user', async () => {
      const mockAdmin = {
        id: 1,
        username: 'admin',
        email: 'admin@example.com',
        role: Role.ADMIN,
        password: 'hashed_password',
        is_active: true,
        created_at: new Date(),
        updated_at: new Date(),
        comments: [],
        ratings: [],
        bookmarks: [],
        histories: [],
      };

      userRepository.findOne.mockResolvedValue(mockAdmin);

      await expect(service.deleteUser(1)).rejects.toThrow('Cannot delete admin user');
      expect(userRepository.remove).not.toHaveBeenCalled();
    });

    it('should throw NotFoundException when user not found', async () => {
      userRepository.findOne.mockResolvedValue(null);

      await expect(service.deleteUser(1)).rejects.toThrow(NotFoundException);
    });
  });

  describe('getAllComments', () => {
    it('should return paginated comments', async () => {
      const expectedResponse = {
        comments: [mockComment],
        total: 1,
        page: 1,
        totalPages: 1,
      };

      commentRepository.findAndCount.mockResolvedValue([[mockComment], 1]);

      const result = await service.getAllComments(1, 10);
      expect(result).toEqual(expectedResponse);
    });
  });

  describe('approveComment', () => {
    it('should approve a comment', async () => {
      commentRepository.findOne.mockResolvedValue(mockComment);
      commentRepository.save.mockResolvedValue({ ...mockComment, isHidden: false });

      const result = await service.approveComment(1);
      expect(result).toEqual({ ...mockComment, isHidden: false });
    });

    it('should throw NotFoundException when comment not found', async () => {
      commentRepository.findOne.mockResolvedValue(null);

      await expect(service.approveComment(1)).rejects.toThrow(NotFoundException);
    });
  });

  describe('deleteComment', () => {
    it('should delete a comment', async () => {
      commentRepository.findOne.mockResolvedValue(mockComment);
      commentRepository.remove.mockResolvedValue(mockComment);

      const result = await service.deleteComment(1);
      expect(result).toEqual({ message: 'Comment deleted successfully' });
    });

    it('should throw NotFoundException when comment not found', async () => {
      commentRepository.findOne.mockResolvedValue(null);

      await expect(service.deleteComment(1)).rejects.toThrow(NotFoundException);
    });
  });

  describe('getAllUserManga', () => {
    it('should return paginated manga', async () => {
      const expectedResponse = {
        manga: [mockManga],
        total: 1,
        page: 1,
        totalPages: 1,
      };

      mangaRepository.findAndCount.mockResolvedValue([[mockManga], 1]);

      const result = await service.getAllUserManga(1, 10);
      expect(result).toEqual(expectedResponse);
    });
  });

  describe('deleteManga', () => {
    it('should delete a manga', async () => {
      mangaRepository.findOne.mockResolvedValue(mockManga);
      mangaRepository.remove.mockResolvedValue(mockManga);

      const result = await service.deleteManga(1);
      expect(result).toEqual({ message: 'Manga deleted successfully' });
    });

    it('should throw NotFoundException when manga not found', async () => {
      mangaRepository.findOne.mockResolvedValue(null);

      await expect(service.deleteManga(1)).rejects.toThrow(NotFoundException);
    });
  });

  describe('deleteChapter', () => {
    it('should delete a chapter', async () => {
      chapterRepository.findOne.mockResolvedValue(mockChapter);
      chapterRepository.remove.mockResolvedValue(mockChapter);

      const result = await service.deleteChapter(1);
      expect(result).toEqual({ message: 'Chapter deleted successfully' });
    });

    it('should throw NotFoundException when chapter not found', async () => {
      chapterRepository.findOne.mockResolvedValue(null);

      await expect(service.deleteChapter(1)).rejects.toThrow(NotFoundException);
    });

    it('should throw error when trying to delete chapter of non-internal manga', async () => {
      const externalChapter = {
        ...mockChapter,
        manga: { ...mockManga, source: 'external' },
      };
      chapterRepository.findOne.mockResolvedValue(externalChapter);

      await expect(service.deleteChapter(1)).rejects.toThrow('Cannot delete chapter of non-internal manga');
    });
  });
}); 
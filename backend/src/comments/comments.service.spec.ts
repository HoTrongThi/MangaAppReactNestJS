import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CommentsService } from './comments.service';
import { Comment } from './entities/comment.entity';
import { Manga } from '../manga/entities/manga.entity';
import { User } from '../users/entities/user.entity';
import { CreateCommentDto } from './dto/create-comment.dto';
import { NotFoundException, UnauthorizedException } from '@nestjs/common';

describe('CommentsService', () => {
  let service: CommentsService;
  let commentRepository: Repository<Comment>;
  let mangaRepository: Repository<Manga>;
  let userRepository: Repository<User>;

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

  const mockComment = {
    id: 1,
    content: 'Test comment',
    manga: mockManga,
    user: mockUser,
    isHidden: false,
    createdAt: new Date(),
    updatedAt: new Date()
  };

  const mockCommentRepository = {
    create: jest.fn(),
    save: jest.fn(),
    find: jest.fn(),
    findOne: jest.fn(),
    remove: jest.fn(),
  };

  const mockMangaRepository = {
    findOne: jest.fn(),
  };

  const mockUserRepository = {
    findOne: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CommentsService,
        {
          provide: getRepositoryToken(Comment),
          useValue: mockCommentRepository,
        },
        {
          provide: getRepositoryToken(Manga),
          useValue: mockMangaRepository,
        },
        {
          provide: getRepositoryToken(User),
          useValue: mockUserRepository,
        },
      ],
    }).compile();

    service = module.get<CommentsService>(CommentsService);
    commentRepository = module.get<Repository<Comment>>(getRepositoryToken(Comment));
    mangaRepository = module.get<Repository<Manga>>(getRepositoryToken(Manga));
    userRepository = module.get<Repository<User>>(getRepositoryToken(User));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    const createCommentDto: CreateCommentDto = {
      content: 'Test comment'
    };

    it('should create a new comment', async () => {
      mockMangaRepository.findOne.mockResolvedValue(mockManga);
      mockUserRepository.findOne.mockResolvedValue(mockUser);
      mockCommentRepository.create.mockReturnValue(mockComment);
      mockCommentRepository.save.mockResolvedValue(mockComment);

      const result = await service.create(1, createCommentDto, 1);
      expect(result).toEqual(mockComment);
      expect(mockMangaRepository.findOne).toHaveBeenCalledWith({ where: { id: 1 } });
      expect(mockUserRepository.findOne).toHaveBeenCalledWith({ where: { id: 1 } });
      expect(mockCommentRepository.create).toHaveBeenCalledWith({
        ...createCommentDto,
        manga: mockManga,
        user: mockUser,
      });
    });

    it('should throw NotFoundException if manga not found', async () => {
      mockMangaRepository.findOne.mockResolvedValue(null);

      await expect(service.create(1, createCommentDto, 1)).rejects.toThrow(NotFoundException);
    });

    it('should throw NotFoundException if user not found', async () => {
      mockMangaRepository.findOne.mockResolvedValue(mockManga);
      mockUserRepository.findOne.mockResolvedValue(null);

      await expect(service.create(1, createCommentDto, 1)).rejects.toThrow(NotFoundException);
    });
  });

  describe('findAllByManga', () => {
    it('should return an array of comments for a manga', async () => {
      mockCommentRepository.find.mockResolvedValue([mockComment]);

      const result = await service.findAllByManga(1);
      expect(result).toEqual([mockComment]);
      expect(mockCommentRepository.find).toHaveBeenCalledWith({
        where: { manga: { id: 1 } },
        relations: ['user'],
        order: { createdAt: 'DESC' },
      });
    });
  });

  describe('findOne', () => {
    it('should return a comment by id', async () => {
      mockCommentRepository.findOne.mockResolvedValue(mockComment);

      const result = await service.findOne(1);
      expect(result).toEqual(mockComment);
      expect(mockCommentRepository.findOne).toHaveBeenCalledWith({
        where: { id: 1 },
        relations: ['user', 'manga'],
      });
    });

    it('should throw NotFoundException if comment not found', async () => {
      mockCommentRepository.findOne.mockResolvedValue(null);

      await expect(service.findOne(1)).rejects.toThrow(NotFoundException);
    });
  });

  describe('toggleHidden', () => {
    it('should toggle comment hidden status', async () => {
      mockCommentRepository.findOne.mockResolvedValue(mockComment);
      mockCommentRepository.save.mockResolvedValue({
        ...mockComment,
        isHidden: true,
      });

      const result = await service.toggleHidden(1);
      expect(result.isHidden).toBe(true);
      expect(mockCommentRepository.save).toHaveBeenCalled();
    });
  });

  describe('remove', () => {
    it('should remove a comment if user is the owner', async () => {
      mockCommentRepository.findOne.mockResolvedValue(mockComment);
      mockUserRepository.findOne.mockResolvedValue(mockUser);

      await service.remove(1, 1);
      expect(mockCommentRepository.remove).toHaveBeenCalledWith(mockComment);
    });

    it('should remove a comment if user is admin', async () => {
      mockCommentRepository.findOne.mockResolvedValue(mockComment);
      mockUserRepository.findOne.mockResolvedValue({
        ...mockUser,
        role: 'admin',
      });

      await service.remove(1, 2);
      expect(mockCommentRepository.remove).toHaveBeenCalledWith(mockComment);
    });

    it('should throw UnauthorizedException if user is not owner or admin', async () => {
      mockCommentRepository.findOne.mockResolvedValue(mockComment);
      mockUserRepository.findOne.mockResolvedValue(mockUser);

      await expect(service.remove(1, 2)).rejects.toThrow(UnauthorizedException);
    });
  });
}); 
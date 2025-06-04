import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ChaptersService } from './chapters.service';
import { Chapter } from './entities/chapter.entity';
import { Manga } from '../manga/entities/manga.entity';
import { CreateChapterDto } from './dto/create-chapter.dto';
import { UpdateChapterDto } from './dto/update-chapter.dto';
import { NotFoundException, BadRequestException } from '@nestjs/common';

describe('ChaptersService', () => {
  let service: ChaptersService;
  let chapterRepository: Repository<Chapter>;
  let mangaRepository: Repository<Manga>;

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

  const mockChapter = {
    id: 1,
    chapterNumber: 1,
    title: 'Chapter 1',
    content: 'Test content',
    manga: mockManga,
    created_at: new Date(),
    updated_at: new Date()
  };

  const mockChapterRepository = {
    create: jest.fn(),
    save: jest.fn(),
    find: jest.fn(),
    findOne: jest.fn(),
    delete: jest.fn(),
  };

  const mockMangaRepository = {
    findOne: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ChaptersService,
        {
          provide: getRepositoryToken(Chapter),
          useValue: mockChapterRepository,
        },
        {
          provide: getRepositoryToken(Manga),
          useValue: mockMangaRepository,
        },
      ],
    }).compile();

    service = module.get<ChaptersService>(ChaptersService);
    chapterRepository = module.get<Repository<Chapter>>(getRepositoryToken(Chapter));
    mangaRepository = module.get<Repository<Manga>>(getRepositoryToken(Manga));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    const createChapterDto: CreateChapterDto = {
      chapterNumber: 1,
      title: 'Chapter 1',
      volumeNumber: '1',
      pages: [],
      source: 'mangadex',
      source_id: '123',
      metadata: {}
    };

    it('should create a new chapter', async () => {
      mockMangaRepository.findOne.mockResolvedValue(mockManga);
      mockChapterRepository.findOne.mockResolvedValue(null);
      mockChapterRepository.create.mockReturnValue(mockChapter);
      mockChapterRepository.save.mockResolvedValue(mockChapter);

      const result = await service.create(1, createChapterDto);
      expect(result).toEqual(mockChapter);
      expect(mockMangaRepository.findOne).toHaveBeenCalledWith({ where: { id: 1 } });
      expect(mockChapterRepository.create).toHaveBeenCalledWith({
        ...createChapterDto,
        manga: mockManga,
      });
    });

    it('should throw NotFoundException if manga not found', async () => {
      mockMangaRepository.findOne.mockResolvedValue(null);

      await expect(service.create(1, createChapterDto)).rejects.toThrow(NotFoundException);
    });

    it('should throw BadRequestException if chapter number already exists', async () => {
      mockMangaRepository.findOne.mockResolvedValue(mockManga);
      mockChapterRepository.findOne.mockResolvedValue(mockChapter);

      await expect(service.create(1, createChapterDto)).rejects.toThrow(BadRequestException);
    });
  });

  describe('findAll', () => {
    it('should return an array of chapters', async () => {
      mockChapterRepository.find.mockResolvedValue([mockChapter]);

      const result = await service.findAll(1);
      expect(result).toEqual([mockChapter]);
      expect(mockChapterRepository.find).toHaveBeenCalledWith({
        where: { manga: { id: 1 } },
        order: { chapterNumber: 'ASC' },
      });
    });
  });

  describe('findAllByManga', () => {
    it('should return an array of chapters for a manga', async () => {
      mockChapterRepository.find.mockResolvedValue([mockChapter]);

      const result = await service.findAllByManga(1);
      expect(result).toEqual([mockChapter]);
      expect(mockChapterRepository.find).toHaveBeenCalledWith({
        where: { manga: { id: 1 } },
        order: { chapterNumber: 'ASC' },
      });
    });
  });

  describe('findOne', () => {
    it('should return a chapter by id', async () => {
      mockChapterRepository.findOne.mockResolvedValue(mockChapter);

      const result = await service.findOne(1);
      expect(result).toEqual(mockChapter);
      expect(mockChapterRepository.findOne).toHaveBeenCalledWith({
        where: { id: 1 },
        relations: ['manga'],
      });
    });

    it('should throw NotFoundException if chapter not found', async () => {
      mockChapterRepository.findOne.mockResolvedValue(null);

      await expect(service.findOne(1)).rejects.toThrow(NotFoundException);
    });
  });

  describe('update', () => {
    const updateChapterDto: UpdateChapterDto = {
      title: 'Updated Chapter',
    };

    it('should update a chapter', async () => {
      mockChapterRepository.findOne.mockResolvedValue(mockChapter);
      mockChapterRepository.save.mockResolvedValue({
        ...mockChapter,
        ...updateChapterDto,
      });

      const result = await service.update(1, updateChapterDto);
      expect(result.title).toBe(updateChapterDto.title);
      expect(mockChapterRepository.save).toHaveBeenCalled();
    });

    it('should throw NotFoundException if chapter not found', async () => {
      mockChapterRepository.findOne.mockResolvedValue(null);

      await expect(service.update(1, updateChapterDto)).rejects.toThrow(NotFoundException);
    });

    it('should throw BadRequestException if new chapter number already exists', async () => {
      mockChapterRepository.findOne.mockResolvedValue(mockChapter);
      mockChapterRepository.findOne.mockResolvedValueOnce(mockChapter);

      await expect(service.update(1, { chapterNumber: 2 })).rejects.toThrow(BadRequestException);
    });
  });

  describe('remove', () => {
    it('should remove a chapter', async () => {
      mockChapterRepository.delete.mockResolvedValue({ affected: 1 });

      await service.remove(1);
      expect(mockChapterRepository.delete).toHaveBeenCalledWith(1);
    });

    it('should throw NotFoundException if chapter not found', async () => {
      mockChapterRepository.delete.mockResolvedValue({ affected: 0 });

      await expect(service.remove(1)).rejects.toThrow(NotFoundException);
    });
  });
}); 
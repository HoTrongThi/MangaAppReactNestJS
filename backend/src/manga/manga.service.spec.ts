import { Test, TestingModule } from '@nestjs/testing';
import { MangaService } from './manga.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Manga } from './entities/manga.entity';
import { Genre } from '../genres/entities/genre.entity';
import { Repository } from 'typeorm';
import { BadRequestException, NotFoundException } from '@nestjs/common';

describe('MangaService', () => {
  let service: MangaService;
  let mangaRepository: Repository<Manga>;
  let genreRepository: Repository<Genre>;

  const mockManga: Partial<Manga> = {
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

  const mockGenre: Partial<Genre> = {
    id: 1,
    name: 'Action'
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MangaService,
        {
          provide: getRepositoryToken(Manga),
          useValue: {
            find: jest.fn(),
            findOne: jest.fn(),
            create: jest.fn(),
            save: jest.fn(),
            remove: jest.fn(),
            delete: jest.fn(),
            createQueryBuilder: jest.fn(() => ({
              leftJoinAndSelect: jest.fn().mockReturnThis(),
              where: jest.fn().mockReturnThis(),
              getMany: jest.fn().mockResolvedValue([]),
            })),
          },
        },
        {
          provide: getRepositoryToken(Genre),
          useValue: {
            findByIds: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<MangaService>(MangaService);
    mangaRepository = module.get(getRepositoryToken(Manga));
    genreRepository = module.get<Repository<Genre>>(getRepositoryToken(Genre));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    const createMangaDto = {
      title: 'New Manga',
      description: 'New Description',
      mangaDexId: 'new-manga-123',
      coverFileName: 'new-cover.jpg',
      author: 'New Author',
      artist: 'New Artist',
      status: 'ongoing',
      type: 'manga',
      source: 'mangadex',
      source_id: '123',
      metadata: {},
      genreIds: [1]
    };

    it('should create a new manga', async () => {
      jest.spyOn(mangaRepository, 'findOne').mockResolvedValue(null);
      jest.spyOn(genreRepository, 'findByIds').mockResolvedValue([mockGenre] as Genre[]);
      
      const newManga = {
        id: 1,
        ...createMangaDto,
        genres: [mockGenre],
        created_at: new Date(),
        updated_at: new Date(),
        chapters: [],
        bookmarks: [],
        histories: [],
        ratings: [],
        comments: []
      } as Manga;

      jest.spyOn(mangaRepository, 'create').mockReturnValue(newManga);
      jest.spyOn(mangaRepository, 'save').mockResolvedValue(newManga);

      const result = await service.create(createMangaDto);
      expect(result).toBeDefined();
      expect(result.title).toBe(createMangaDto.title);
      expect(result.genres).toHaveLength(1);
    });

    it('should throw BadRequestException if mangaDexId already exists', async () => {
      jest.spyOn(mangaRepository, 'findOne').mockResolvedValue(mockManga as Manga);

      await expect(service.create(createMangaDto)).rejects.toThrow(BadRequestException);
    });
  });

  describe('findAll', () => {
    it('should return an array of mangas', async () => {
      jest.spyOn(mangaRepository, 'find').mockResolvedValue([mockManga] as Manga[]);

      const result = await service.findAll();
      expect(result).toEqual([mockManga]);
      expect(mangaRepository.find).toHaveBeenCalledWith({
        relations: ['genres'],
      });
    });
  });

  describe('findOne', () => {
    it('should return a manga by id', async () => {
      jest.spyOn(mangaRepository, 'findOne').mockResolvedValue(mockManga as Manga);

      const result = await service.findOne(1);
      expect(result).toEqual(mockManga);
      expect(mangaRepository.findOne).toHaveBeenCalledWith({
        where: { id: 1 },
        relations: ['genres', 'chapters'],
      });
    });

    it('should throw NotFoundException if manga not found', async () => {
      jest.spyOn(mangaRepository, 'findOne').mockResolvedValue(null);

      await expect(service.findOne(999)).rejects.toThrow(NotFoundException);
    });
  });

  describe('update', () => {
    const updateMangaDto = {
      title: 'Updated Manga',
      genreIds: [1]
    };

    it('should update a manga', async () => {
      jest.spyOn(mangaRepository, 'findOne').mockResolvedValue(mockManga as Manga);
      jest.spyOn(genreRepository, 'findByIds').mockResolvedValue([mockGenre] as Genre[]);
      jest.spyOn(mangaRepository, 'save').mockResolvedValue({
        ...mockManga,
        ...updateMangaDto,
        genres: [mockGenre],
      } as Manga);

      const result = await service.update(1, updateMangaDto);
      expect(result.title).toBe(updateMangaDto.title);
      expect(result.genres).toHaveLength(1);
    });

    it('should throw NotFoundException if manga not found', async () => {
      jest.spyOn(mangaRepository, 'findOne').mockResolvedValue(null);

      await expect(service.update(999, updateMangaDto)).rejects.toThrow(NotFoundException);
    });
  });

  describe('remove', () => {
    it('should remove a manga', async () => {
      jest.spyOn(mangaRepository, 'delete').mockResolvedValue({ affected: 1 } as any);

      await service.remove(1);
      expect(mangaRepository.delete).toHaveBeenCalledWith(1);
    });

    it('should throw NotFoundException if manga not found', async () => {
      jest.spyOn(mangaRepository, 'delete').mockResolvedValue({ affected: 0 } as any);

      await expect(service.remove(999)).rejects.toThrow(NotFoundException);
    });
  });

  describe('findByMangaDexId', () => {
    it('should return a manga by mangaDexId', async () => {
      jest.spyOn(mangaRepository, 'findOne').mockResolvedValue(mockManga as Manga);

      const result = await service.findByMangaDexId('test-manga-123');
      expect(result).toEqual(mockManga);
      expect(mangaRepository.findOne).toHaveBeenCalledWith({
        where: { mangaDexId: 'test-manga-123' },
        relations: ['genres', 'chapters'],
      });
    });

    it('should throw NotFoundException if manga not found', async () => {
      jest.spyOn(mangaRepository, 'findOne').mockResolvedValue(null);

      await expect(service.findByMangaDexId('nonexistent')).rejects.toThrow(NotFoundException);
    });
  });

  describe('findByUserId', () => {
    it('should return an array of mangas for a user', async () => {
      const mockManga = {
        id: 1,
        title: 'Test Manga',
        user: { id: 1 },
      };

      const mockQueryBuilder = {
        leftJoinAndSelect: jest.fn().mockReturnThis(),
        where: jest.fn().mockReturnThis(),
        getMany: jest.fn().mockResolvedValue([mockManga]),
      };

      jest.spyOn(mangaRepository, 'createQueryBuilder').mockReturnValue(mockQueryBuilder as any);

      const result = await service.findByUserId(1);
      expect(result).toEqual([mockManga]);
      expect(mangaRepository.createQueryBuilder).toHaveBeenCalled();
      expect(mockQueryBuilder.leftJoinAndSelect).toHaveBeenCalledWith('manga.user', 'user');
      expect(mockQueryBuilder.where).toHaveBeenCalledWith('user.id = :userId', { userId: 1 });
    });
  });
}); 
import { Test, TestingModule } from '@nestjs/testing';
import { MangaController } from './manga.controller';
import { MangaService } from './manga.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Manga } from './entities/manga.entity';
import { Genre } from '../genres/entities/genre.entity';
import { CreateMangaDto } from './dto/create-manga.dto';
import { UpdateMangaDto } from './dto/update-manga.dto';
import { Role } from '../users/entities/role.enum';

describe('MangaController', () => {
  let controller: MangaController;
  let mangaService: MangaService;

  const mockGenre: Genre = {
    id: 1,
    name: 'Action',
  };

  const mockManga: Partial<Manga> = {
    id: 1,
    title: 'Test Manga',
    description: 'Test Description',
    author: 'Test Author',
    artist: 'Test Artist',
    status: 'ongoing',
    type: 'manga',
    genres: [mockGenre],
    mangaDexId: 'test-manga-123',
    coverFileName: 'test-cover.jpg',
    source: 'mangadex',
    source_id: '123',
    created_at: new Date(),
    updated_at: new Date(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MangaController],
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
          },
        },
        {
          provide: getRepositoryToken(Genre),
          useValue: {
            find: jest.fn(),
            findOne: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<MangaController>(MangaController);
    mangaService = module.get<MangaService>(MangaService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should create a new manga', async () => {
      const createMangaDto: CreateMangaDto = {
        title: 'Test Manga',
        description: 'Test Description',
        author: 'Test Author',
        artist: 'Test Artist',
        status: 'ongoing',
        type: 'manga',
        genreIds: [1],
        mangaDexId: 'test-manga-123',
      };

      jest.spyOn(mangaService, 'create').mockResolvedValue(mockManga as Manga);

      const result = await controller.create(createMangaDto, { user: { id: 1, role: Role.ADMIN } });
      expect(result).toEqual(mockManga);
    });
  });

  describe('findAll', () => {
    it('should return an array of manga', async () => {
      jest.spyOn(mangaService, 'findAll').mockResolvedValue([mockManga] as Manga[]);

      const result = await controller.findAll();
      expect(result).toEqual([mockManga]);
    });

    it('should return mangas by user id', async () => {
      jest.spyOn(mangaService, 'findByUserId').mockResolvedValue([mockManga] as Manga[]);

      const result = await controller.findAll('1');
      expect(result).toEqual([mockManga]);
    });
  });

  describe('findOne', () => {
    it('should return a manga by id', async () => {
      jest.spyOn(mangaService, 'findOne').mockResolvedValue(mockManga as Manga);

      const result = await controller.findOne('1');
      expect(result).toEqual(mockManga);
    });
  });

  describe('findByMangaDexId', () => {
    it('should return a manga by mangaDexId', async () => {
      jest.spyOn(mangaService, 'findByMangaDexId').mockResolvedValue(mockManga as Manga);

      const result = await controller.findByMangaDexId('test-manga-123');
      expect(result).toEqual(mockManga);
    });
  });

  describe('update', () => {
    it('should update a manga', async () => {
      const updateMangaDto: UpdateMangaDto = {
        title: 'Updated Manga',
        description: 'Updated Description',
        genreIds: [1],
      };

      const updatedManga = { ...mockManga, ...updateMangaDto };
      jest.spyOn(mangaService, 'update').mockResolvedValue(updatedManga as Manga);

      const result = await controller.update('1', updateMangaDto);
      expect(result).toEqual(updatedManga);
    });
  });

  describe('remove', () => {
    it('should remove a manga', async () => {
      jest.spyOn(mangaService, 'remove').mockResolvedValue(undefined);

      await controller.remove('1');
      expect(mangaService.remove).toHaveBeenCalledWith(1);
    });
  });
}); 
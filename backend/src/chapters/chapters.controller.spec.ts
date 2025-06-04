import { Test, TestingModule } from '@nestjs/testing';
import { ChaptersController } from './chapters.controller';
import { ChaptersService } from './chapters.service';
import { CreateChapterDto } from './dto/create-chapter.dto';
import { UpdateChapterDto } from './dto/update-chapter.dto';
import { Role } from '../users/entities/role.enum';

describe('ChaptersController', () => {
  let controller: ChaptersController;
  let service: ChaptersService;

  const mockChapter = {
    id: 1,
    chapterNumber: 1,
    title: 'Chapter 1',
    volumeNumber: '1',
    pages: [],
    source: 'mangadex',
    source_id: '123',
    metadata: {},
    manga: {
      id: 1,
      title: 'Test Manga'
    },
    created_at: new Date(),
    updated_at: new Date()
  };

  const mockChaptersService = {
    create: jest.fn(),
    findAll: jest.fn(),
    findAllByManga: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ChaptersController],
      providers: [
        {
          provide: ChaptersService,
          useValue: mockChaptersService,
        },
      ],
    }).compile();

    controller = module.get<ChaptersController>(ChaptersController);
    service = module.get<ChaptersService>(ChaptersService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
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
      jest.spyOn(service, 'create').mockResolvedValue(mockChapter as any);

      const result = await controller.create('1', createChapterDto);
      expect(result).toEqual(mockChapter);
      expect(service.create).toHaveBeenCalledWith(1, createChapterDto);
    });
  });

  describe('findAllByManga', () => {
    it('should return an array of chapters for a manga', async () => {
      jest.spyOn(service, 'findAllByManga').mockResolvedValue([mockChapter] as any[]);

      const result = await controller.findAllByManga('1');
      expect(result).toEqual([mockChapter]);
      expect(service.findAllByManga).toHaveBeenCalledWith(1);
    });
  });

  describe('findOne', () => {
    it('should return a chapter by id', async () => {
      jest.spyOn(service, 'findOne').mockResolvedValue(mockChapter as any);

      const result = await controller.findOne('1');
      expect(result).toEqual(mockChapter);
      expect(service.findOne).toHaveBeenCalledWith(1);
    });
  });

  describe('update', () => {
    const updateChapterDto: UpdateChapterDto = {
      title: 'Updated Chapter',
    };

    it('should update a chapter', async () => {
      jest.spyOn(service, 'update').mockResolvedValue({
        ...mockChapter,
        ...updateChapterDto,
      } as any);

      const result = await controller.update('1', updateChapterDto);
      expect(result.title).toBe(updateChapterDto.title);
      expect(service.update).toHaveBeenCalledWith(1, updateChapterDto);
    });
  });

  describe('remove', () => {
    it('should remove a chapter', async () => {
      jest.spyOn(service, 'remove').mockResolvedValue(undefined);

      await controller.remove('1');
      expect(service.remove).toHaveBeenCalledWith(1);
    });
  });
}); 
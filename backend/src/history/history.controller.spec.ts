import { Test, TestingModule } from '@nestjs/testing';
import { HistoryController } from './history.controller';
import { HistoryService } from './history.service';
import { CreateHistoryDto } from './dto/create-history.dto';

describe('HistoryController', () => {
  let controller: HistoryController;
  let service: HistoryService;

  const mockHistory = {
    id: 1,
    chapterNumber: 1,
    pageNumber: 1,
    user: {
      id: 1,
      username: 'testuser'
    },
    manga: {
      id: 1,
      title: 'Test Manga'
    },
    createdAt: new Date(),
    updatedAt: new Date()
  };

  const mockHistoryService = {
    create: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
    remove: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [HistoryController],
      providers: [
        {
          provide: HistoryService,
          useValue: mockHistoryService,
        },
      ],
    }).compile();

    controller = module.get<HistoryController>(HistoryController);
    service = module.get<HistoryService>(HistoryService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    const createHistoryDto: CreateHistoryDto = {
      mangaId: 1,
      chapterNumber: 1,
      pageNumber: 1
    };

    it('should create a new history', async () => {
      jest.spyOn(service, 'create').mockResolvedValue(mockHistory as any);

      const result = await controller.create({ user: { id: 1 } }, createHistoryDto);
      expect(result).toEqual(mockHistory);
      expect(service.create).toHaveBeenCalledWith(1, createHistoryDto);
    });
  });

  describe('findAll', () => {
    it('should return an array of histories for a user', async () => {
      jest.spyOn(service, 'findAll').mockResolvedValue([mockHistory] as any[]);

      const result = await controller.findAll({ user: { id: 1 } });
      expect(result).toEqual([mockHistory]);
      expect(service.findAll).toHaveBeenCalledWith(1);
    });
  });

  describe('findOne', () => {
    it('should return a history by user and manga', async () => {
      jest.spyOn(service, 'findOne').mockResolvedValue(mockHistory as any);

      const result = await controller.findOne({ user: { id: 1 } }, '1');
      expect(result).toEqual(mockHistory);
      expect(service.findOne).toHaveBeenCalledWith(1, 1);
    });
  });

  describe('remove', () => {
    it('should remove a history', async () => {
      jest.spyOn(service, 'remove').mockResolvedValue(undefined);

      await controller.remove({ user: { id: 1 } }, '1');
      expect(service.remove).toHaveBeenCalledWith(1, 1);
    });
  });
}); 
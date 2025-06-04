import { Test, TestingModule } from '@nestjs/testing';
import { GenresController } from './genres.controller';
import { GenresService } from './genres.service';

describe('GenresController', () => {
  let controller: GenresController;
  let service: GenresService;

  const mockGenre = {
    id: 1,
    name: 'Action',
    description: 'Action genre description',
    createdAt: new Date(),
    updatedAt: new Date()
  };

  const mockGenresService = {
    findAll: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [GenresController],
      providers: [
        {
          provide: GenresService,
          useValue: mockGenresService,
        },
      ],
    }).compile();

    controller = module.get<GenresController>(GenresController);
    service = module.get<GenresService>(GenresService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('findAll', () => {
    it('should return an array of genres', async () => {
      jest.spyOn(service, 'findAll').mockResolvedValue([mockGenre] as any[]);

      const result = await controller.findAll();
      expect(result).toEqual([mockGenre]);
      expect(service.findAll).toHaveBeenCalled();
    });

    it('should return empty array when no genres exist', async () => {
      jest.spyOn(service, 'findAll').mockResolvedValue([]);

      const result = await controller.findAll();
      expect(result).toEqual([]);
      expect(service.findAll).toHaveBeenCalled();
    });
  });
}); 
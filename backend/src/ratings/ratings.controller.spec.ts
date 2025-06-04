import { Test, TestingModule } from '@nestjs/testing';
import { RatingsController } from './ratings.controller';
import { RatingsService } from './ratings.service';
import { CreateRatingDto } from './dto/create-rating.dto';

describe('RatingsController', () => {
  let controller: RatingsController;
  let service: RatingsService;

  const mockRating = {
    id: 1,
    score: 5,
    comment: 'Great manga!',
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

  const mockRatingsService = {
    create: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
    getAverageRating: jest.fn(),
    remove: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [RatingsController],
      providers: [
        {
          provide: RatingsService,
          useValue: mockRatingsService,
        },
      ],
    }).compile();

    controller = module.get<RatingsController>(RatingsController);
    service = module.get<RatingsService>(RatingsService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    const createRatingDto: CreateRatingDto = {
      score: 5,
      comment: 'Great manga!'
    };

    it('should create a new rating', async () => {
      jest.spyOn(service, 'create').mockResolvedValue(mockRating as any);

      const result = await controller.create({ user: { id: 1 } }, '1', createRatingDto);
      expect(result).toEqual(mockRating);
      expect(service.create).toHaveBeenCalledWith(1, 1, createRatingDto);
    });
  });

  describe('findAll', () => {
    it('should return an array of ratings for a manga', async () => {
      jest.spyOn(service, 'findAll').mockResolvedValue([mockRating] as any[]);

      const result = await controller.findAll('1');
      expect(result).toEqual([mockRating]);
      expect(service.findAll).toHaveBeenCalledWith(1);
    });
  });

  describe('getAverageRating', () => {
    it('should return average rating and count', async () => {
      const mockAverage = { average: 4.5, count: 10 };
      jest.spyOn(service, 'getAverageRating').mockResolvedValue(mockAverage);

      const result = await controller.getAverageRating('1');
      expect(result).toEqual(mockAverage);
      expect(service.getAverageRating).toHaveBeenCalledWith(1);
    });
  });

  describe('findOne', () => {
    it('should return a rating by user and manga', async () => {
      jest.spyOn(service, 'findOne').mockResolvedValue(mockRating as any);

      const result = await controller.findOne({ user: { id: 1 } }, '1');
      expect(result).toEqual(mockRating);
      expect(service.findOne).toHaveBeenCalledWith(1, 1);
    });
  });

  describe('remove', () => {
    it('should remove a rating', async () => {
      jest.spyOn(service, 'remove').mockResolvedValue(undefined);

      await controller.remove({ user: { id: 1 } }, '1');
      expect(service.remove).toHaveBeenCalledWith(1, 1);
    });
  });
}); 
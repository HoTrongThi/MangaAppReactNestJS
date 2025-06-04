import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { GenresService } from './genres.service';
import { Genre } from './entities/genre.entity';

describe('GenresService', () => {
  let service: GenresService;
  let genresRepository: Repository<Genre>;

  const mockGenre = {
    id: 1,
    name: 'Action',
    description: 'Action genre description',
    createdAt: new Date(),
    updatedAt: new Date()
  };

  const mockGenresRepository = {
    find: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        GenresService,
        {
          provide: getRepositoryToken(Genre),
          useValue: mockGenresRepository,
        },
      ],
    }).compile();

    service = module.get<GenresService>(GenresService);
    genresRepository = module.get<Repository<Genre>>(getRepositoryToken(Genre));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findAll', () => {
    it('should return an array of genres', async () => {
      mockGenresRepository.find.mockResolvedValue([mockGenre]);

      const result = await service.findAll();
      expect(result).toEqual([mockGenre]);
      expect(mockGenresRepository.find).toHaveBeenCalled();
    });

    it('should return empty array when no genres exist', async () => {
      mockGenresRepository.find.mockResolvedValue([]);

      const result = await service.findAll();
      expect(result).toEqual([]);
      expect(mockGenresRepository.find).toHaveBeenCalled();
    });
  });
}); 
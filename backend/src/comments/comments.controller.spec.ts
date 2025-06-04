import { Test, TestingModule } from '@nestjs/testing';
import { CommentsController } from './comments.controller';
import { CommentsService } from './comments.service';
import { CreateCommentDto } from './dto/create-comment.dto';
import { Role } from '../users/entities/role.enum';

describe('CommentsController', () => {
  let controller: CommentsController;
  let service: CommentsService;

  const mockComment = {
    id: 1,
    content: 'Test comment',
    manga: {
      id: 1,
      title: 'Test Manga'
    },
    user: {
      id: 1,
      username: 'testuser'
    },
    isHidden: false,
    createdAt: new Date(),
    updatedAt: new Date()
  };

  const mockCommentsService = {
    create: jest.fn(),
    findAllByManga: jest.fn(),
    findOne: jest.fn(),
    toggleHidden: jest.fn(),
    remove: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CommentsController],
      providers: [
        {
          provide: CommentsService,
          useValue: mockCommentsService,
        },
      ],
    }).compile();

    controller = module.get<CommentsController>(CommentsController);
    service = module.get<CommentsService>(CommentsService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    const createCommentDto: CreateCommentDto = {
      content: 'Test comment'
    };

    it('should create a new comment', async () => {
      jest.spyOn(service, 'create').mockResolvedValue(mockComment as any);

      const result = await controller.create('1', createCommentDto, { user: { id: 1 } });
      expect(result).toEqual(mockComment);
      expect(service.create).toHaveBeenCalledWith(1, createCommentDto, 1);
    });
  });

  describe('findAllByManga', () => {
    it('should return an array of comments for a manga', async () => {
      jest.spyOn(service, 'findAllByManga').mockResolvedValue([mockComment] as any[]);

      const result = await controller.findAllByManga('1');
      expect(result).toEqual([mockComment]);
      expect(service.findAllByManga).toHaveBeenCalledWith(1);
    });
  });

  describe('findOne', () => {
    it('should return a comment by id', async () => {
      jest.spyOn(service, 'findOne').mockResolvedValue(mockComment as any);

      const result = await controller.findOne('1');
      expect(result).toEqual(mockComment);
      expect(service.findOne).toHaveBeenCalledWith(1);
    });
  });

  describe('toggleHidden', () => {
    it('should toggle comment hidden status', async () => {
      jest.spyOn(service, 'toggleHidden').mockResolvedValue({
        ...mockComment,
        isHidden: true,
      } as any);

      const result = await controller.toggleHidden('1');
      expect(result.isHidden).toBe(true);
      expect(service.toggleHidden).toHaveBeenCalledWith(1);
    });
  });

  describe('remove', () => {
    it('should remove a comment', async () => {
      jest.spyOn(service, 'remove').mockResolvedValue(undefined);

      await controller.remove('1', { user: { id: 1 } });
      expect(service.remove).toHaveBeenCalledWith(1, 1);
    });
  });
}); 
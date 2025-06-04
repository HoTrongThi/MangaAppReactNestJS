import { Test, TestingModule } from '@nestjs/testing';
import { AdminPanelController } from './admin-panel.controller';
import { AdminPanelService } from './admin-panel.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { Role } from '../users/entities/role.enum';
import { User } from '../users/entities/user.entity';
import { Comment } from '../comments/entities/comment.entity';

describe('AdminPanelController', () => {
  let controller: AdminPanelController;
  let adminPanelService: AdminPanelService;

  const mockUser: User = {
    id: 1,
    username: 'testuser',
    email: 'test@example.com',
    role: Role.USER,
    password: 'hashed_password',
    is_active: true,
    created_at: new Date(),
    updated_at: new Date(),
    comments: [],
    ratings: [],
    bookmarks: [],
    histories: [],
  };

  const mockComment: Comment = {
    id: 1,
    content: 'Test comment',
    isHidden: false,
    user: mockUser,
    manga: null,
    parent: null,
    replies: [],
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AdminPanelController],
      providers: [
        {
          provide: AdminPanelService,
          useValue: {
            getAllUsers: jest.fn(),
            updateUser: jest.fn(),
            deleteUser: jest.fn(),
            getAllComments: jest.fn(),
            approveComment: jest.fn(),
            deleteComment: jest.fn(),
            getAllUserManga: jest.fn(),
            deleteManga: jest.fn(),
            deleteChapter: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<AdminPanelController>(AdminPanelController);
    adminPanelService = module.get<AdminPanelService>(AdminPanelService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('getAllUsers', () => {
    it('should return paginated users', async () => {
      const expectedResponse = {
        users: [mockUser],
        total: 1,
        page: 1,
        totalPages: 1,
      };

      jest.spyOn(adminPanelService, 'getAllUsers').mockResolvedValue(expectedResponse);

      const result = await controller.getAllUsers('1', '10');
      expect(result).toEqual(expectedResponse);
    });
  });

  describe('updateUser', () => {
    it('should update a user', async () => {
      const updateUserDto: UpdateUserDto = {
        role: Role.ADMIN,
      };

      const updatedUser = { ...mockUser, ...updateUserDto };
      jest.spyOn(adminPanelService, 'updateUser').mockResolvedValue(updatedUser);

      const result = await controller.updateUser('1', updateUserDto);
      expect(result).toEqual(updatedUser);
    });
  });

  describe('deleteUser', () => {
    it('should delete a user', async () => {
      const expectedResponse = { message: 'User deleted successfully' };
      jest.spyOn(adminPanelService, 'deleteUser').mockResolvedValue(expectedResponse);

      const result = await controller.deleteUser('1');
      expect(result).toEqual(expectedResponse);
    });
  });

  describe('getAllComments', () => {
    it('should return paginated comments', async () => {
      const expectedResponse = {
        comments: [mockComment],
        total: 1,
        page: 1,
        totalPages: 1,
      };

      jest.spyOn(adminPanelService, 'getAllComments').mockResolvedValue(expectedResponse);

      const result = await controller.getAllComments('1', '10');
      expect(result).toEqual(expectedResponse);
    });
  });

  describe('approveComment', () => {
    it('should approve a comment', async () => {
      jest.spyOn(adminPanelService, 'approveComment').mockResolvedValue(mockComment);

      const result = await controller.approveComment('1');
      expect(result).toEqual(mockComment);
    });
  });

  describe('deleteComment', () => {
    it('should delete a comment', async () => {
      const expectedResponse = { message: 'Comment deleted successfully' };
      jest.spyOn(adminPanelService, 'deleteComment').mockResolvedValue(expectedResponse);

      const result = await controller.deleteComment('1');
      expect(result).toEqual(expectedResponse);
    });
  });

  describe('getAllUserManga', () => {
    it('should return paginated manga', async () => {
      const expectedResponse = {
        manga: [],
        total: 0,
        page: 1,
        totalPages: 0,
      };

      jest.spyOn(adminPanelService, 'getAllUserManga').mockResolvedValue(expectedResponse);

      const result = await controller.getAllUserManga('1', '10');
      expect(result).toEqual(expectedResponse);
    });
  });

  describe('deleteManga', () => {
    it('should delete a manga', async () => {
      const expectedResponse = { message: 'Manga deleted successfully' };
      jest.spyOn(adminPanelService, 'deleteManga').mockResolvedValue(expectedResponse);

      const result = await controller.deleteManga('1');
      expect(result).toEqual(expectedResponse);
    });
  });

  describe('deleteChapter', () => {
    it('should delete a chapter', async () => {
      const expectedResponse = { message: 'Chapter deleted successfully' };
      jest.spyOn(adminPanelService, 'deleteChapter').mockResolvedValue(expectedResponse);

      const result = await controller.deleteChapter('1');
      expect(result).toEqual(expectedResponse);
    });
  });
}); 
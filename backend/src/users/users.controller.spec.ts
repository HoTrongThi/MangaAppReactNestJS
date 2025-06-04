import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Role } from './entities/role.enum';

describe('UsersController', () => {
  let controller: UsersController;
  let usersService: UsersService;

  const mockUser: User = {
    id: 1,
    username: 'testuser',
    email: 'test@example.com',
    password: 'hashed_password',
    role: Role.USER,
    is_active: true,
    created_at: new Date(),
    updated_at: new Date(),
    comments: [],
    ratings: [],
    bookmarks: [],
    histories: [],
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        UsersService,
        {
          provide: getRepositoryToken(User),
          useValue: {
            find: jest.fn(),
            findOne: jest.fn(),
            create: jest.fn(),
            save: jest.fn(),
            remove: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<UsersController>(UsersController);
    usersService = module.get<UsersService>(UsersService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('findAll', () => {
    it('should return an array of users', async () => {
      const usersWithoutPassword = [{
        id: mockUser.id,
        username: mockUser.username,
        email: mockUser.email,
        role: mockUser.role,
        is_active: mockUser.is_active,
        created_at: mockUser.created_at,
        updated_at: mockUser.updated_at,
        comments: mockUser.comments,
        ratings: mockUser.ratings,
        bookmarks: mockUser.bookmarks,
        histories: mockUser.histories,
      }] as User[];

      jest.spyOn(usersService, 'findAll').mockResolvedValue(usersWithoutPassword);

      const result = await controller.findAll();
      expect(result).toEqual(usersWithoutPassword);
    });
  });

  describe('findOne', () => {
    it('should return a user', async () => {
      const userWithoutPassword = {
        id: mockUser.id,
        username: mockUser.username,
        email: mockUser.email,
        role: mockUser.role,
        is_active: mockUser.is_active,
        created_at: mockUser.created_at,
        updated_at: mockUser.updated_at,
        comments: mockUser.comments,
        ratings: mockUser.ratings,
        bookmarks: mockUser.bookmarks,
        histories: mockUser.histories,
      } as User;

      jest.spyOn(usersService, 'findOne').mockResolvedValue(userWithoutPassword);

      const mockReq = {
        user: {
          id: 1,
          role: Role.USER
        }
      };

      const result = await controller.findOne('1', mockReq);
      expect(result).toEqual(userWithoutPassword);
    });
  });

  describe('update', () => {
    it('should update a user', async () => {
      const updateUserDto = {
        username: 'updateduser',
      };

      const updatedUser = { ...mockUser, ...updateUserDto };
      jest.spyOn(usersService, 'update').mockResolvedValue(updatedUser);

      const result = await controller.update('1', updateUserDto);
      expect(result).toEqual(updatedUser);
    });
  });

  describe('remove', () => {
    it('should remove a user', async () => {
      jest.spyOn(usersService, 'remove').mockResolvedValue(undefined);

      const result = await controller.remove('1');
      expect(result).toBeUndefined();
    });
  });
});

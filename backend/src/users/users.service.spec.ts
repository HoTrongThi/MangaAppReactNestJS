import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { Role } from './entities/role.enum';
import { NotFoundException } from '@nestjs/common';

describe('UsersService', () => {
  let service: UsersService;
  let repository: Repository<User>;

  const mockUser: Partial<User> = {
    id: 1,
    username: 'testuser',
    email: 'test@example.com',
    password: 'hashedPassword',
    role: Role.USER,
    is_active: true,
    created_at: new Date(),
    updated_at: new Date(),
    bookmarks: [],
    comments: [],
    ratings: []
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: getRepositoryToken(User),
          useValue: {
            findOne: jest.fn(),
            save: jest.fn(),
            create: jest.fn(),
            find: jest.fn(),
            update: jest.fn(),
            delete: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
    repository = module.get<Repository<User>>(getRepositoryToken(User));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findByEmail', () => {
    it('should return user when found', async () => {
      jest.spyOn(repository, 'findOne').mockResolvedValue(mockUser as User);

      const result = await service.findByEmail('test@example.com');
      expect(result).toEqual(mockUser);
      expect(repository.findOne).toHaveBeenCalledWith({
        where: { email: 'test@example.com' },
      });
    });

    it('should return null when user not found', async () => {
      jest.spyOn(repository, 'findOne').mockResolvedValue(null);

      const result = await service.findByEmail('nonexistent@example.com');
      expect(result).toBeNull();
    });
  });

  describe('create', () => {
    const createUserDto = {
      username: 'newuser',
      email: 'new@example.com',
      password: 'password123',
    };

    it('should create and return new user', async () => {
      const hashedPassword = 'hashedPassword123';
      jest.spyOn(bcrypt, 'hash').mockImplementation(() => Promise.resolve(hashedPassword));
      jest.spyOn(repository, 'create').mockReturnValue({
        ...createUserDto,
        password: hashedPassword,
      } as User);
      jest.spyOn(repository, 'save').mockResolvedValue({
        ...createUserDto,
        password: hashedPassword,
        id: 1,
        role: Role.USER,
        is_active: true,
        created_at: new Date(),
        updated_at: new Date(),
        bookmarks: [],
        comments: [],
        ratings: []
      } as User);

      const result = await service.create(createUserDto);
      expect(result).toBeDefined();
      expect(result.password).toBe(hashedPassword);
      expect(bcrypt.hash).toHaveBeenCalledWith(createUserDto.password, 10);
    });
  });

  describe('update', () => {
    it('should update and return user', async () => {
      const updateUserDto = {
        username: 'updateduser',
      };

      const updatedUser = {
        ...mockUser,
        ...updateUserDto,
      };

      jest.spyOn(repository, 'findOne').mockResolvedValue(mockUser as User);
      jest.spyOn(repository, 'save').mockResolvedValue(updatedUser as User);

      const result = await service.update(1, updateUserDto);
      expect(result).toBeDefined();
      expect(result.username).toBe(updateUserDto.username);
    });

    it('should throw NotFoundException when user not found', async () => {
      jest.spyOn(repository, 'findOne').mockResolvedValue(null);

      await expect(service.update(1, { username: 'updateduser' })).rejects.toThrow(NotFoundException);
    });
  });

  describe('remove', () => {
    it('should remove user', async () => {
      jest.spyOn(repository, 'delete').mockResolvedValue({ affected: 1 } as any);

      await service.remove(1);
      expect(repository.delete).toHaveBeenCalledWith(1);
    });

    it('should throw error when user not found', async () => {
      jest.spyOn(repository, 'delete').mockResolvedValue({ affected: 0 } as any);

      await expect(service.remove(999)).rejects.toThrow();
    });
  });
});

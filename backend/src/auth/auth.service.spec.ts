import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from '../users/entities/user.entity';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { Role } from '../users/entities/role.enum';

describe('AuthService', () => {
  let service: AuthService;
  let usersService: UsersService;
  let jwtService: JwtService;
  let userRepository: Repository<User>;

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
        AuthService,
        {
          provide: UsersService,
          useValue: {
            findOne: jest.fn(),
            findByEmail: jest.fn(),
            create: jest.fn(),
          },
        },
        {
          provide: JwtService,
          useValue: {
            sign: jest.fn().mockReturnValue('test-token'),
          },
        },
        {
          provide: getRepositoryToken(User),
          useValue: {
            findOne: jest.fn(),
            save: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    usersService = module.get<UsersService>(UsersService);
    jwtService = module.get<JwtService>(JwtService);
    userRepository = module.get<Repository<User>>(getRepositoryToken(User));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('validateUser', () => {
    it('should return user object when credentials are valid', async () => {
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
      };

      jest.spyOn(usersService, 'findByEmail').mockResolvedValue(userWithoutPassword as User);
      jest.spyOn(bcrypt, 'compare').mockImplementation(() => Promise.resolve(true));

      const result = await service.validateUser('test@example.com', 'password123');
      expect(result).toEqual(userWithoutPassword);
    });

    it('should return null when user is not found', async () => {
      jest.spyOn(usersService, 'findByEmail').mockResolvedValue(null);

      const result = await service.validateUser('nonexistent@example.com', 'password123');
      expect(result).toBeNull();
    });

    it('should return null when password is invalid', async () => {
      jest.spyOn(usersService, 'findByEmail').mockResolvedValue(mockUser as User);
      jest.spyOn(bcrypt, 'compare').mockImplementation(() => Promise.resolve(false));

      const result = await service.validateUser('test@example.com', 'wrongpassword');
      expect(result).toBeNull();
    });
  });

  describe('login', () => {
    it('should return JWT token and user data', async () => {
      jest.spyOn(jwtService, 'sign').mockReturnValue('test-token');

      const result = await service.login(mockUser as User);
      expect(result).toEqual({
        access_token: 'test-token',
        user: {
          id: mockUser.id,
          username: mockUser.username,
          email: mockUser.email,
          role: mockUser.role,
        },
      });
    });
  });

  describe('register', () => {
    it('should create new user and return JWT token', async () => {
      const registerDto = {
        username: 'newuser',
        email: 'new@example.com',
        password: 'password123',
      };

      const newUser = {
        id: 1,
        ...registerDto,
        role: Role.USER,
        is_active: true,
        created_at: new Date(),
        updated_at: new Date(),
        comments: [],
        ratings: [],
        bookmarks: [],
        histories: [],
      };

      jest.spyOn(usersService, 'create').mockResolvedValue(newUser as User);
      jest.spyOn(jwtService, 'sign').mockReturnValue('test-token');

      const result = await service.register(registerDto);
      expect(result).toEqual({
        access_token: 'test-token',
        user: {
          id: newUser.id,
          username: newUser.username,
          email: newUser.email,
          role: newUser.role,
          is_active: newUser.is_active,
          created_at: newUser.created_at,
          updated_at: newUser.updated_at,
          comments: newUser.comments,
          ratings: newUser.ratings,
          bookmarks: newUser.bookmarks,
          histories: newUser.histories,
        },
      });
    });

    it('should throw error if user already exists', async () => {
      jest.spyOn(usersService, 'findByEmail').mockResolvedValue(mockUser as User);

      await expect(service.register(mockUser as User)).rejects.toThrow();
    });
  });
});

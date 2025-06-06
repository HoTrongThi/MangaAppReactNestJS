import { Injectable, UnauthorizedException, Logger } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { CreateUserDto } from '../users/dto/create-user.dto';
import * as bcrypt from 'bcrypt';
import { Role } from '../users/entities/user.entity';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async validateUser(email: string, password: string): Promise<any> {
    try {
      this.logger.debug(`Validating user: ${email}`);
      const user = await this.usersService.findByEmail(email);
      this.logger.debug(`Found user: ${user ? 'Yes' : 'No'}`);
      
      if (user) {
        const isPasswordValid = await bcrypt.compare(password, user.password);
        this.logger.debug(`Password valid: ${isPasswordValid}`);
        
        if (isPasswordValid) {
          const { password, ...result } = user;
          return result;
        }
      }
      return null;
    } catch (error) {
      this.logger.error(`Error in validateUser: ${error.message}`);
      return null;
    }
  }

  async login(user: any) {
    this.logger.debug(`Logging in user: ${JSON.stringify(user)}`);
    
    // Ensure role is a valid Role enum value
    const role = user.role as Role;
    this.logger.debug(`User role: ${role}`);
    
    // Create payload with required information
    const payload = {
      email: user.email,
      sub: user.id,
      role: role,
      username: user.username
    };

    this.logger.debug(`Creating token with payload: ${JSON.stringify(payload)}`);

    // Create token with 24 hour expiration
    const token = this.jwtService.sign(payload, {
      expiresIn: '24h'
    });
    
    this.logger.debug(`Generated token: ${token}`);
    
    return {
      access_token: token,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        role: role,
      },
    };
  }

  async register(createUserDto: CreateUserDto): Promise<any> {
    // Don't hash password here as UsersService.create() already hashes it
    const newUser = await this.usersService.create({
      ...createUserDto,
      role: createUserDto.role || Role.USER,
    });

    const { password, ...result } = newUser;
    const role = result.role as Role;
    
    const payload = { 
      email: result.email, 
      sub: result.id, 
      role: role,
      username: result.username
    };
    
    this.logger.debug(`Creating token for new user with payload: ${JSON.stringify(payload)}`);
    
    return {
      access_token: this.jwtService.sign(payload, {
        expiresIn: '24h'
      }),
      user: result,
    };
  }

  // Method to validate user based on JWT payload (used by JwtStrategy)
  async validateUserByJwt(payload: any) {
    const role = payload.role as Role;
    this.logger.debug(`Validating JWT payload with role: ${role}`);
    
    return { 
      userId: payload.sub, 
      email: payload.email, 
      role: role,
      username: payload.username
    };
  }
}

import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { CreateUserDto } from '../users/dto/create-user.dto';
import * as bcrypt from 'bcrypt';
import { Role } from '../users/entities/user.entity';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async validateUser(email: string, password: string): Promise<any> {
    try {
      console.log('Validating user:', email);
      const user = await this.usersService.findByEmail(email);
      console.log('Found user:', user ? 'Yes' : 'No');
      
      if (user) {
        const isPasswordValid = await bcrypt.compare(password, user.password);
        console.log('Password valid:', isPasswordValid);
        
        if (isPasswordValid) {
          const { password, ...result } = user;
          return result;
        }
      }
      return null;
    } catch (error) {
      console.error('Error in validateUser:', error);
      return null;
    }
  }

  async login(user: any) {
    console.log('Logging in user:', user);
    
    // Tạo payload với thông tin cần thiết
    const payload = {
      email: user.email,
      sub: user.id,
      role: user.role,
      username: user.username
    };

    // Tạo token với thời gian hết hạn 24 giờ
    const token = this.jwtService.sign(payload, {
      expiresIn: '24h'
    });
    
    console.log('Generated token:', token);
    
    return {
      access_token: token,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role,
      },
    };
  }

  async register(createUserDto: CreateUserDto): Promise<any> {
    // Không hash mật khẩu ở đây vì UsersService.create() đã hash rồi
    const newUser = await this.usersService.create({
      ...createUserDto,
      role: createUserDto.role || Role.USER,
    });

    const { password, ...result } = newUser;
    const payload = { 
      email: result.email, 
      sub: result.id, 
      role: result.role,
      username: result.username
    };
    
    return {
      access_token: this.jwtService.sign(payload, {
        expiresIn: '24h'
      }),
      user: result,
    };
  }

  // Method to validate user based on JWT payload (used by JwtStrategy)
  async validateUserByJwt(payload: any) {
    return { 
      userId: payload.sub, 
      email: payload.email, 
      role: payload.role,
      username: payload.username
    };
  }
}

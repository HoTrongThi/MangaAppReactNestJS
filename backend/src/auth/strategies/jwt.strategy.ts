import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, Logger } from '@nestjs/common';
import { Role } from '../../users/entities/user.entity';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  private readonly logger = new Logger(JwtStrategy.name);

  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: 'suppersecret', // Use the same secret as in AuthModule
    });
  }

  async validate(payload: any) {
    this.logger.debug(`JWT Strategy - Validating payload: ${JSON.stringify(payload)}`);
    
    // Ensure role is returned as Role enum value
    const role = payload.role as Role;
    this.logger.debug(`User role from payload: ${role}`);

    // Return a complete user object that matches the User entity structure
    return {
      id: payload.sub,
      email: payload.email,
      username: payload.username,
      role: role,
      is_active: true
    };
  }
} 
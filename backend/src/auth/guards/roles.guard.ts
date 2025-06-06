import { Injectable, CanActivate, ExecutionContext, Logger } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';
import { Role } from '../../users/entities/user.entity';
import { ROLES_KEY } from '../decorators/roles.decorator'; // We will create this decorator

@Injectable()
export class RolesGuard implements CanActivate {
  private readonly logger = new Logger(RolesGuard.name);

  constructor(private reflector: Reflector) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const requiredRoles = this.reflector.getAllAndOverride<Role[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    
    this.logger.debug(`Required roles: ${JSON.stringify(requiredRoles)}`);
    
    if (!requiredRoles) {
      return true;
    }

    const { user } = context.switchToHttp().getRequest();
    this.logger.debug(`User from request: ${JSON.stringify(user)}`);

    if (!user || !user.role) {
      this.logger.error('No user or role found in request');
      return false;
    }

    const userRole = user.role;
    const hasRole = requiredRoles.includes(userRole);
    
    this.logger.debug(`User role: ${userRole}, Required roles: ${requiredRoles}, Has role: ${hasRole}`);
    
    return hasRole;
  }
} 
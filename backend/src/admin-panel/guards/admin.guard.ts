import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Role } from '../../users/enums/role.enum';

@Injectable()
export class AdminGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    return request.user?.role === Role.ADMIN;
  }
} 
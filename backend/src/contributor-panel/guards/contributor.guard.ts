import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Role } from '../../users/entities/user.entity';

@Injectable()
export class ContributorGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    return request.user?.role === Role.CONTRIBUTOR || request.user?.role === Role.ADMIN;
  }
} 
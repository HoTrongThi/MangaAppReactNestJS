import { Injectable, ExecutionContext, Logger } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { tap, catchError } from 'rxjs/operators';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  private readonly logger = new Logger(JwtAuthGuard.name);

  canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest();
    this.logger.debug('JwtAuthGuard - Checking Authorization header');
    this.logger.debug(`Authorization header: ${request.headers.authorization}`);

    const result = super.canActivate(context);
    
    if (typeof result === 'boolean') {
      this.logger.debug(`JwtAuthGuard - canActivate result (boolean): ${result}`);
      return result;
    } else if (result instanceof Promise) {
      this.logger.debug('JwtAuthGuard - canActivate result (Promise)');
      return result.then(value => {
        this.logger.debug(`JwtAuthGuard - canActivate resolved (Promise): ${value}`);
        return value;
      }).catch(error => {
        this.logger.error(`JwtAuthGuard - canActivate rejected (Promise): ${error.message}`);
        throw error;
      });
    } else if (result instanceof Object && typeof result.subscribe === 'function') { // Observable
      this.logger.debug('JwtAuthGuard - canActivate result (Observable)');
      return result.pipe(
        tap(value => this.logger.debug(`JwtAuthGuard - canActivate emitted (Observable): ${value}`)),
        catchError(error => {
          this.logger.error(`JwtAuthGuard - canActivate error (Observable): ${error.message}`);
          throw error;
        })
      );
    } else {
       this.logger.debug(`JwtAuthGuard - canActivate result (unknown type): ${result}`);
       return result;
    }
  }
} 
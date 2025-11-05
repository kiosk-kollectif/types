import {
  Injectable,
  CallHandler,
  ExecutionContext,
  NestInterceptor,
  HttpStatus,
} from '@nestjs/common';
import { Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { Reflector } from '@nestjs/core';
import { InvalidesTokenService } from 'src/invalides-token/invalides-token.service';
import { INVALIDE_TOKEN_DECORATOR_KEY } from 'src/common/utils/constants';
import { Request, Response } from 'express';

@Injectable()
export class InvalideTokenInterceptor implements NestInterceptor {
  constructor(
    private readonly invalideTokenService: InvalidesTokenService,
    private readonly reflector: Reflector,
  ) {}

  intercept(
    context: ExecutionContext,
    next: CallHandler<any>,
  ): Observable<any> {
    const shouldValidate = this.reflector.getAllAndOverride<boolean>(
      INVALIDE_TOKEN_DECORATOR_KEY,
      [context.getHandler(), context.getClass()],
    );

    if (!shouldValidate) return next.handle();

    const request = context.switchToHttp().getRequest<Request>();
    const auth = request.headers.authorization;
    if (!auth) return next.handle();

    const token = auth.startsWith('Bearer ')
      ? auth.slice(7)
      : auth.split(' ')[1];

    return next.handle().pipe(
      tap((response) => {
        const resp = response as { statusCode: number };
        if (token && resp && resp.statusCode >= 200 && resp.statusCode < 300) {
          void this.invalideTokenService.add(token);
        }
      }),
      catchError((err) => throwError(() => err as Error)),
    );
  }
}

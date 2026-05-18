import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Response as ExpressResponse } from 'express';
import { RESPONSE_MESSAGE } from '../decorator/response-message.decorator';

@Injectable()
export class TransformInterceptor<T> implements NestInterceptor<T, any> {
  constructor(private reflector: Reflector) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const message = this.reflector.getAllAndOverride<string>(RESPONSE_MESSAGE, [
      context.getHandler(),
      context.getClass(),
    ]);

    // Si pas de décorateur ResponseMessage, on retourne la réponse telle quelle
    if (!message) {
      return next.handle();
    }

    const response = context.switchToHttp().getResponse<ExpressResponse>();
    const statusCode = response.statusCode;

    return next.handle().pipe(
      map((data: T) => ({
        StatusCode: statusCode,
        message,
        data: data ?? undefined,
      })),
    );
  }
}

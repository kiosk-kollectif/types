import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';
import { Request } from 'express';

@Injectable()
export class OwnerRequestGuard implements CanActivate {
  constructor(private readonly authService: AuthService) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const req = context.switchToHttp().getRequest<Request>();

    const authHeader = req.headers.authorization;
    if (typeof authHeader !== 'string') return false;

    const token = authHeader.split(' ')[1];
    if (!token) return false;

    const payload = this.authService.verifyToken(token);
    if (!payload) return false;

    const id = req.params?.id || (req.query?.id as string) || null;

    if (!id) return false;

    return String(payload.id) === id;
  }
}

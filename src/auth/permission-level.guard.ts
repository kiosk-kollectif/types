import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';
import { PERMISSION_LEVEL_KEY } from '../common/decorator/permission-level.decorator';
import { Request } from 'express';
import { AuthService } from './auth.service';

@Injectable()
export class PermissionLevelGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly authService: AuthService,
  ) {}
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const permissionLevel = this.reflector.get<string[]>(
      PERMISSION_LEVEL_KEY,
      context.getHandler(),
    );

    if (!permissionLevel) return true;

    const req: Request = context.switchToHttp().getRequest();
    const role = this.getPermissionLevel(req);

    if (!role) return false;

    return permissionLevel.includes(role);
  }

  private getPermissionLevel(req: Request) {
    const token = req.headers?.authorization?.split(' ')[1] || null;

    if (!token) return null;

    const playload = this.authService.verifyToken(token);
    if (!playload) return null;
    return playload.role;
  }
}

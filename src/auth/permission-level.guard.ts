import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { PERMISSION_LEVEL_KEY } from '../common/decorator/permission-level.decorator';
import { Request } from 'express';
import { AuthService } from './auth.service';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from 'src/users/users.schema';
import { Model } from 'mongoose';
import { InvalidesTokenService } from 'src/invalides-token/invalides-token.service';

@Injectable()
export class PermissionLevelGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly authService: AuthService,
    private readonly invalidesTokenService: InvalidesTokenService,
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
  ) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const permissionLevel = this.reflector.get<string[]>(
      PERMISSION_LEVEL_KEY,
      context.getHandler(),
    );

    if (!permissionLevel || permissionLevel.length === 0) return true;

    const req: Request = context.switchToHttp().getRequest();

    let existsUser: UserDocument;
    try {
      const playload = await this.getPermissionLevel(req);

      if (!playload?.role) return false;
      const user = await this.userModel.findById(playload.id);
      if (!user) return false;
      existsUser = user;
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      return false;
    }

    req.user = existsUser;
    return permissionLevel.includes(existsUser.role);
  }

  private async getPermissionLevel(req: Request) {
    const token = req.headers?.authorization?.split(' ')[1] || null;

    if (!token) return null;
    const valide = !(await this.invalidesTokenService.exist(token));
    if (!valide) throw new UnauthorizedException('Invalide Token');
    const playload = this.authService.verifyToken(token);
    if (!playload) return null;
    return playload;
  }
}

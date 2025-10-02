import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { PERMISSION_LEVEL_KEY } from '../common/decorator/permission-level.decorator';
import { Request } from 'express';
import { AuthService } from './auth.service';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from 'src/users/users.schema';
import { Model } from 'mongoose';

@Injectable()
export class PermissionLevelGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly authService: AuthService,
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
  ) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const permissionLevel = this.reflector.get<string[]>(
      PERMISSION_LEVEL_KEY,
      context.getHandler(),
    );

    if (!permissionLevel) return true;

    const req: Request = context.switchToHttp().getRequest();

    let existsUser: UserDocument;
    try {
      const playload = this.getPermissionLevel(req);

      if (!playload?.role) return false;
      const user = await this.userModel.findById(playload._id);
      if (!user) return false;
      existsUser = user;
    } catch (error) {
      console.log(error);
      return false;
    }

    req.user = existsUser;
    // console.log(existsUser);
    return permissionLevel.includes(existsUser.role);
  }

  private getPermissionLevel(req: Request) {
    const token = req.headers?.authorization?.split(' ')[1] || null;

    if (!token) return null;

    const playload = this.authService.verifyToken(token);
    if (!playload) return null;
    return playload;
  }
}

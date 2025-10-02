import {
  createParamDecorator,
  InternalServerErrorException,
  SetMetadata,
} from '@nestjs/common';
import { Request } from 'express';
import { AuthPayload } from 'src/auth/auth.service';
import { UserDocument } from './users.schema';

export const Users = (...args: string[]) => SetMetadata('users', args);

export const User = createParamDecorator(
  (data: keyof AuthPayload | undefined, ctx) => {
    const request: Request & { user: UserDocument } = ctx
      .switchToHttp()
      .getRequest();
    const user = request.user;

    if (data) {
      if (data in user) {
        return user[data];
      } else {
        throw new InternalServerErrorException(
          `Property ${data} does not exist on user Object`,
        );
      }
    } else {
      return user;
    }
  },
);

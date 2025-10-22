import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Types } from 'mongoose';
import { UserPublicInfo, UserRole } from 'src/types';
import { UserProfil } from 'src/users/users.schema';

@Injectable()
export class AuthService {
  constructor(private jwtService: JwtService) {}

  signToken<T extends object>(payload: T) {
    return this.jwtService.sign(payload);
  }

  verifyToken(token: string): UserPublicInfo {
    return this.jwtService.verify(token);
  }
}

export class AuthPayload {
  _id: Types.ObjectId;
  firstname: string;
  lastname: string;
  email: string;
  profil: UserProfil;
  role: UserRole;
  verified: boolean;
  createdAt: Date;
  updatedAt: Date;
}

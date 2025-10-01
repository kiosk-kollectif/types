import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Types } from 'mongoose';
import { Role } from 'src/common/enums/role.enum';
import { UserProfil } from 'src/users/users.schema';

@Injectable()
export class AuthService {
  constructor(private jwtService: JwtService) {}

  signToken(playload: AuthPayload) {
    return this.jwtService.sign({
      _id: playload._id,
      firstname: playload.firstname,
      lastname: playload.lastname,
      email: playload.email,
      profil: playload.profil,
      role: playload.role,
      verified: playload.verified,
      createdAt: playload.createdAt,
      updatedAt: playload.updatedAt,
    });
  }

  verifyToken(token: string): AuthPayload {
    return this.jwtService.verify(token);
  }
}

export class AuthPayload {
  _id: Types.ObjectId;
  firstname: string;
  lastname: string;
  email: string;
  profil: UserProfil;
  role: Role;
  verified: boolean;
  createdAt: Date;
  updatedAt: Date;
}

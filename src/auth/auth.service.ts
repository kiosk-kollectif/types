import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { console } from 'inspector';
import { Types } from 'mongoose';

@Injectable()
export class AuthService {
  constructor(private jwtService: JwtService) {}

  signToken(playload: AuthPayload) {
    console.log('playload:', playload);
    return this.jwtService.sign({
      _id: playload._id,
      firstname: playload.firstname,
      lastname: playload.lastname,
      email: playload.email,
      role: playload.role,
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
  role: string;
  createdAt: Date;
  updatedAt: Date;
}

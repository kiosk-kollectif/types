import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { CreateUserDto } from 'src/users/dto/create-user.dto';

@Injectable()
export class AuthService {
  constructor(private jwtService: JwtService) {}

  signToken(playload: CreateUserDto) {
    return this.jwtService.sign({
      firstname: playload.firstname,
      lastname: playload.lastname,
      email: playload.email,
      role: playload.role,
    });
  }

  verifyToken(token: string): AuthPayload {
    return this.jwtService.verify(token);
  }
}

export class AuthPayload {
  firstname: string;
  lastname: string;
  email: string;
  role: string;
}

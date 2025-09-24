import {
  BadRequestException,
  ConflictException,
  Injectable,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from './users.schema';
import { Model } from 'mongoose';
import { CreateUserDto } from './dto/create-user.dto';
import { hashPassword } from 'src/utils/passwordHashManager';
import { AuthService } from 'src/auth/auth.service';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
    private readonly authService: AuthService,
  ) {}
  async getUsers(): Promise<string[]> {
    return new Promise((res) => {
      res(['user1', 'user2']);
    });
  }

  async registerUser(user: CreateUserDto): Promise<string> {
    const { firstname, lastname, email, password } = user;

    if (!firstname || !lastname || !email) {
      throw new BadRequestException('Please provide all required fields');
    }

    const exists = await this.userModel.findOne({ email });

    if (exists) {
      throw new ConflictException('User already exists');
    }

    await this.userModel.create({
      firstname,
      lastname,
      email,
      passwordHash: password ? hashPassword(password) : null,
    });

    const token = this.authService.signToken(user);

    return token;
  }
}

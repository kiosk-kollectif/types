import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from './users.schema';
import { Model } from 'mongoose';
import { CreateUserDto } from './dto/create-user.dto';
import { hashPassword, verifyPasswword } from 'src/utils/passwordHashManager';
import { AuthPayload, AuthService } from 'src/auth/auth.service';
import { LoginUserInfoDto } from './dto/login-user-info.dto';
import { sendEmail } from 'src/utils/mailers';

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

    const newUser = await this.userModel.create({
      firstname,
      lastname,
      email,
      passwordHash: password ? hashPassword(password) : null,
    });

    const token = this.authService.signToken(newUser as AuthPayload);

    return token;
  }

  async userLogin(user: LoginUserInfoDto): Promise<string> {
    const { email, password } = user;

    const exist = await this.userModel.findOne({ email });

    if (!exist) {
      throw new NotFoundException('User does not exist');
    }

    const verifiedPassword = verifyPasswword(password, exist.passwordHash);

    if (!verifiedPassword) {
      throw new BadRequestException('Invalid password');
    }

    const token = this.authService.signToken(exist as AuthPayload);

    return token;
  }

  async getUserById(id: string): Promise<UserDocument> {
    const user = await this.userModel.findById(id);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }

  async sendConfirmationMail(id: string): Promise<void> {
    const user = await this.getUserById(id);

    //TODO Cheick if user Is ALready Verifired
    await sendEmail(user.email, 343849);
  }
}

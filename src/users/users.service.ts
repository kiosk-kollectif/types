import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from './users.schema';
import { Model } from 'mongoose';
import { CreateUserDto } from './dto/create-user.dto';
import { hashPassword, verifyPasswword } from 'src/utils/passwordHashManager';
import { AuthPayload, AuthService } from 'src/auth/auth.service';
import { LoginUserInfoDto } from './dto/login-user-info.dto';
import { EditUserProfilDto } from './dto/edit-user-profil.dto';
import {
  ResetPasswordRequest,
  ResetPasswordRequestDocument,
} from './reset-password-request.schema';
import { randomBytes } from 'crypto';
import { sendPasswordResetMail } from 'src/utils/mailers';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
    @InjectModel(ResetPasswordRequest.name)
    private readonly resetPasswordReqModel: Model<ResetPasswordRequestDocument>,
    private readonly authService: AuthService,
  ) {}

  private async getLastPasswordResetRequest(id: string) {
    return await this.resetPasswordReqModel
      .findOne({ userId: id })
      .sort({ createdAt: -1 });
  }

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

  async activeUserVerification(id: string) {
    const user = await this.getUserById(id);

    if (user.verified) {
      throw new BadRequestException('User already verified');
    }

    user.verified = true;
    await user.save();
  }

  async editUserProfile(id: string, userProfil: EditUserProfilDto) {
    const user = await this.getUserById(id);

    user.profil = { ...user.profil, ...userProfil };
    await user.save();

    return this.authService.signToken(user as AuthPayload);
  }

  async requestPasswordReset(id: string) {
    const user = await this.getUserById(id);

    const lastRequest = await this.getLastPasswordResetRequest(id);

    if (lastRequest) {
      if (!lastRequest.isExpired) {
        throw new UnauthorizedException(
          'Please wait for the previous request to expire',
        );
      }

      lastRequest.expireAt = new Date(Date.now());
      await lastRequest.save();
    }

    const newRequest = await this.resetPasswordReqModel.create({
      userId: id,
      code: randomBytes(32).toString('hex'),
    });

    await sendPasswordResetMail(user.email, newRequest.code);
  }
}

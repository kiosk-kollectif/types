import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from './users.schema';
import { Model, Types } from 'mongoose';
import { CreateUserDto } from './dto/create-user.dto';
import {
  hashPassword,
  verifyPasswword,
} from 'src/common/utils/passwordHashManager';
import { AuthService } from 'src/auth/auth.service';
import { LoginUserInfoDto } from './dto/login-user-info.dto';
import { EditUserProfilDto } from './dto/edit-user-profil.dto';
import {
  ResetPasswordRequest,
  ResetPasswordRequestDocument,
} from './reset-password-request.schema';
import { randomBytes } from 'crypto';
import { sendPasswordResetMail } from 'src/common/utils/mailers';
import { EditUserInfoDto } from './dto/edit-user-info.dto';
import sharp from 'sharp';
import { uploadFile } from 'src/common/utils/cloudinary';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
    @InjectModel(ResetPasswordRequest.name)
    private readonly resetPasswordReqModel: Model<ResetPasswordRequestDocument>,
    private readonly authService: AuthService,
  ) {}

  private async getLastPasswordResetRequest(id: string | Types.ObjectId) {
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
    const { username, email, password } = user;

    if (!username || !email || !email) {
      throw new BadRequestException('Please provide all required fields');
    }

    const exists = await this.userModel.findOne({ email });

    if (exists) {
      throw new ConflictException('User already exists');
    }

    const newUser = await this.userModel.create({
      username,
      email,
      passwordHash: password ? hashPassword(password) : null,
    });

    const token = this.authService.signToken(newUser.toJSON());

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

    const token = this.authService.signToken(exist.toJSON());

    return token;
  }

  async getUserById(id: string | Types.ObjectId): Promise<UserDocument> {
    const user = await this.userModel.findById(id);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }

  async editUserProfile(
    user: UserDocument,
    userProfil: EditUserProfilDto,
    picture?: Express.Multer.File,
  ) {
    if (picture) {
      const thumbBuffer = await sharp(picture.buffer)
        .resize({ width: 200 })
        .jpeg({ quality: 50 })
        .toBuffer();

      const thumburl = await uploadFile(
        {
          buffer: thumbBuffer,
        } as Express.Multer.File,
        'thumbnail',
      );

      const profileUrl = await uploadFile(picture, 'users_profils');

      user.profil.picture = profileUrl;
      user.profil.thumbnail = thumburl;
    }

    if (userProfil.adress) user.profil.adress = userProfil.adress;

    //TODO: Amelioerer la logique de verification pour le numero de telephone
    if (userProfil.phone) user.profil.phone = userProfil.phone;

    await user.save();

    return this.authService.signToken(user.toJSON());
  }

  async requestPasswordReset(user: UserDocument) {
    const lastRequest = await this.getLastPasswordResetRequest(user._id);

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
      userId: user._id,
      code: randomBytes(32).toString('hex'),
    });

    await sendPasswordResetMail(user.email, newRequest.code);
  }

  async editUserInfo(user: UserDocument, userInfo: EditUserInfoDto) {
    // Hasher le mots de passe
    if (userInfo.password) {
      user.passwordHash = hashPassword(userInfo['password']);
    }
    //Appliquer des verifications sur l'email
    // if (userInfo.email && userInfo.email !== user.email) {
    //   user.email = userInfo.email;
    //   user.verified = false;
    // }

    // if (userInfo.firstname) user.firstname = userInfo.firstname;
    // if (userInfo.lastname) user.lastname = userInfo.lastname;

    await user.save();
    return this.authService.signToken(user.toJSON());
  }
}

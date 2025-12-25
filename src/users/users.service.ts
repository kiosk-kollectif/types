import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import {
  User,
  UserDocument,
  UserProfil,
  UserProfilDocument,
} from './users.schema';
import { Model, RootFilterQuery, Types } from 'mongoose';
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
import { UserRole, UserStats } from 'src/types';
import { InvalidesTokenService } from 'src/invalides-token/invalides-token.service';
import { ReservationsService } from 'src/reservations/reservations.service';
import { GetUsersQueryRequestDto } from './dto/get-users.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
    @InjectModel(ResetPasswordRequest.name)
    private readonly resetPasswordReqModel: Model<ResetPasswordRequestDocument>,
    @InjectModel(UserProfil.name)
    private readonly userProfilModel: Model<UserProfilDocument>,
    private readonly authService: AuthService,
    private readonly invalidateTokenService: InvalidesTokenService,
    private readonly reservationService: ReservationsService,
  ) {}

  private async getLastPasswordResetRequest(id: string | Types.ObjectId) {
    return await this.resetPasswordReqModel
      .findOne({ userId: id })
      .sort({ createdAt: -1 });
  }

  async getUsers(request: GetUsersQueryRequestDto) {
    const searchQuery: RootFilterQuery<UserDocument> = {};
    if (request.status) searchQuery.status = request.status;
    if (request.role) searchQuery.role = request.role;
    if (request.search) {
      searchQuery.$or = [
        { username: { $regex: request.search, $options: 'i' } },
        { email: { $regex: request.search, $options: 'i' } },
      ];
    }

    const skip = (request.page - 1) * request.limit;

    const [users, total] = await Promise.all([
      this.userModel
        .find({
          ...searchQuery,
          role: { $nin: [UserRole.ADMIN, UserRole.MANAGER] },
        })
        .skip(skip)
        .limit(request.limit),
      this.userModel.countDocuments(searchQuery),
    ]);

    const totalPages = Math.ceil(total / request.limit);

    return {
      users: users.map((u) => u.getUserProfil()),
      currentPage: request.page,
      totalPages,
      limit: request.limit,
      totalItems: total,
    };
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

    const token = this.authService.signToken(newUser.getUserPublicProfil());

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

    const token = this.authService.signToken(exist.getUserPublicProfil());

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
    if (!user.profil) user.profil = new this.userProfilModel({ _id: user._id });

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
    } else if (userProfil.picture == 'removed') {
      if (user.profil.picture) user.profil.picture = undefined;
      if (user.profil.thumbnail) user.profil.thumbnail = undefined;
    }

    if (userProfil.adress) user.profil.adress = userProfil.adress;
    //TODO: Amelioerer la logique de verification pour le numero de telephone
    if (userProfil.phone) user.profil.phone = userProfil.phone;
    if (userProfil.firstname) user.profil.firstname = userProfil.firstname;
    if (userProfil.lastname) user.profil.lastname = userProfil.lastname;

    await user.save();

    return {
      user: { ...user.getUserPublicProfil(), profil: user.profil },
      token: this.authService.signToken(user.getUserPublicProfil()),
    };
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
    if (userInfo.password) {
      user.passwordHash = hashPassword(userInfo['password']);
    }

    if (
      userInfo.email &&
      userInfo.email.toLowerCase() !== user.email.toLowerCase()
    ) {
      user.email = userInfo.email;
      user.verified = false;
    }

    if (userInfo.username) {
      user.username = userInfo.username;
    }

    await user.save();
    return {
      user: { ...user.getUserPublicProfil(), profil: user.profil },
      token: this.authService.signToken(user.getUserPublicProfil()),
    };
  }

  async getUserStats(user: UserDocument): Promise<UserStats> {
    return await this.reservationService.getReservationsForUser(user);
  }

  generateUserToken(user: UserDocument) {
    return this.authService.signToken(user.getUserPublicProfil());
  }

  async disconnectUser(token: string) {
    return this.invalidateTokenService.add(token);
  }
}

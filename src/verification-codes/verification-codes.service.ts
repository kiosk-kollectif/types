import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import {
  isExpired,
  isOlderThanOneMinute,
  VerificationCode,
  VerificationCodeDocument,
} from './verification-codes.schema';
import { Model, Types } from 'mongoose';
import { sendAccountConfirmationMail } from 'src/common/utils/mailers';
import { UserDocument } from 'src/users/users.schema';
import { AuthService } from 'src/auth/auth.service';
import { mapUserToPublicInfo } from 'src/users/users.mapper';

@Injectable()
export class VerificationCodesService {
  constructor(
    @InjectModel(VerificationCode.name)
    private readonly verificationCodeModel: Model<VerificationCodeDocument>,
    private readonly jwtService: AuthService,
  ) {}

  private async getLastVerificationCode(userId: string | Types.ObjectId) {
    return await this.verificationCodeModel
      .findOne({ userId })
      .sort({ createdAt: -1 });
  }

  async createVerificationCode(user: UserDocument) {
    if (user.verified) throw new ConflictException('User already verifed');

    const lastVerification = await this.verificationCodeModel
      .findOne({ userId: user._id })
      .sort({ createdAt: -1 });

    if (lastVerification && !isOlderThanOneMinute(lastVerification.createdAt)) {
      throw new UnauthorizedException(
        'Veillez patienter avant de redemander un nouveau code',
      );
    }

    const verificationCode = await this.verificationCodeModel.create({
      userId: user._id,
      code: Math.floor(100000 + Math.random() * 900000),
    });

    await sendAccountConfirmationMail(user.email, verificationCode.code);
  }

  async confirmVerificationCode(user: UserDocument, code: number) {
    if (user.verified) throw new ConflictException('User already verifed');
    const lastVerificationCode = await this.getLastVerificationCode(user._id);

    if (
      !lastVerificationCode ||
      isExpired(lastVerificationCode.expireAt) ||
      lastVerificationCode.code !== code
    ) {
      throw new UnauthorizedException('Code de vérification invalide');
    }

    user.verified = true;
    await user.save();
    return this.jwtService.signToken(mapUserToPublicInfo(user));
  }
}

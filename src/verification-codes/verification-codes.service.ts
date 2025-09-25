import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import {
  VerificationCode,
  VerificationCodeDocument,
} from './verification-codes.schema';
import { Model } from 'mongoose';
import { UsersService } from 'src/users/users.service';
import { sendAccountConfirmationMail } from 'src/utils/mailers';

@Injectable()
export class VerificationCodesService {
  constructor(
    @InjectModel(VerificationCode.name)
    private readonly verificationCodeModel: Model<VerificationCodeDocument>,
    private readonly usersService: UsersService,
  ) {}

  private async getLastVerificationCode(userId: string) {
    return await this.verificationCodeModel
      .findOne({ userId })
      .sort({ createdAt: -1 });
  }

  async createVerificationCode(id: string) {
    const user = await this.usersService.getUserById(id);

    const lastVerification = await this.verificationCodeModel
      .findOne({ userId: user._id })
      .sort({ createdAt: -1 });

    if (lastVerification && !lastVerification.isOlderThanOneMinute) {
      throw new UnauthorizedException(
        'Veillez patienter avant de redemander un nouveau code',
      );
    }

    const VerificationCode = await this.verificationCodeModel.create({
      userId: user._id,
      code: Math.floor(100000 + Math.random() * 900000),
    });

    await sendAccountConfirmationMail(user.email, VerificationCode.code);
  }

  async confirmVerificationCode(id: string, code: number) {
    const lastVerificationCode = await this.getLastVerificationCode(id);

    if (
      !lastVerificationCode ||
      lastVerificationCode.isExpired ||
      lastVerificationCode.code !== code
    ) {
      throw new UnauthorizedException('Code de vérification invalide');
    }

    await this.usersService.activeUserVerification(id);
  }
}

import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  InvalideTokenDocument,
  InvalideTokens,
} from './invalides-token-schema';

@Injectable()
export class InvalidesTokenService {
  constructor(
    @InjectModel(InvalideTokens.name)
    private readonly invalideTokenModel: Model<InvalideTokenDocument>,
  ) {}

  async add(token: string) {
    return this.invalideTokenModel.create({ token });
  }

  async exist(token: string) {
    return this.invalideTokenModel.findOne({ token });
  }
}

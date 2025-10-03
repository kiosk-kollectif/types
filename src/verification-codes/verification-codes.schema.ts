import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

export type VerificationCodeDocument = VerificationCode & Document;

@Schema({
  collection: 'verification-codes',
  timestamps: true,
  versionKey: false,
})
export class VerificationCode {
  @Prop({ required: true })
  code: number;

  @Prop({ default: new Date(Date.now() + 1000 * 60 * 10), required: true }) //Expire dans 10min
  expireAt: Date;

  @Prop({ default: Date.now(), required: true })
  createdAt: Date;

  @Prop({ required: true })
  userId: string;

  get isExpired(): boolean {
    return this.expireAt.getTime() < new Date().getTime();
  }

  get isOlderThanOneMinute(): boolean {
    return this.createdAt.getTime() < new Date().getTime() - 60 * 1000;
  }
}

export const VerificationCodesSchema =
  SchemaFactory.createForClass(VerificationCode);

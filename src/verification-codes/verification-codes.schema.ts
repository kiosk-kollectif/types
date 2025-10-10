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
}

export const VerificationCodesSchema =
  SchemaFactory.createForClass(VerificationCode);

export function isOlderThanOneMinute(createdAt: Date | string): boolean {
  console.log(createdAt);
  return (
    (typeof createdAt === 'string'
      ? new Date(createdAt)
      : createdAt
    ).getTime() <
    new Date().getTime() - 60 * 1000
  );
}

export const isExpired = (expireAt: Date | string): boolean => {
  return (
    (typeof expireAt === 'string' ? new Date(expireAt) : expireAt).getTime() <
    new Date().getTime()
  );
};

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

  @Prop({ required: true })
  userId: string;

  @Prop({
    default: () => new Date(Date.now() + 60 * 1000 * 5), //5min
    required: true,
  })
  expireAt: Date;

  createdAt: Date;

  updatedAt: Date;
}

export const VerificationCodesSchema =
  SchemaFactory.createForClass(VerificationCode);

export function isOlderThanOneMinute(createdAt: Date | string): boolean {
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

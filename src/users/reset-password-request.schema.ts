import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

export type ResetPasswordRequestDocument = ResetPasswordRequest & Document;
@Schema()
export class ResetPasswordRequest {
  @Prop({ required: true })
  userId: string;

  @Prop({ required: true })
  code: string;

  @Prop({ required: true, default: new Date(Date.now() + 1000 * 60 * 5) })
  expireAt: Date;

  @Prop({ required: true, default: false })
  isUsed: boolean;

  get isExpired(): boolean {
    return Date.now() > this.expireAt.getTime();
  }
}

export const ResetPasswordRequestSchema =
  SchemaFactory.createForClass(ResetPasswordRequest);

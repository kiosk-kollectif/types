import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { ApplicantRequestStatus } from 'src/types';
import { User } from 'src/users/users.schema';

export type ApplicantRequestDocument = ApplicantRequest & Document;

@Schema({
  collection: 'applicant_requests',
  versionKey: false,
  timestamps: true,
})
export class ApplicantRequest {
  @Prop({ required: true, ref: User.name })
  user_id: Types.ObjectId;

  @Prop({ required: true, default: ApplicantRequestStatus.PENDING })
  status: ApplicantRequestStatus;

  createdAt: Date;
  updatedAt: Date;
}

export const ApplicantRequestSchema =
  SchemaFactory.createForClass(ApplicantRequest);

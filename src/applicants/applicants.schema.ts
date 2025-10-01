import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { ApplicantRequestStatus } from 'src/common/enums/applicant-request-status.enum';
import { User } from 'src/users/users.schema';

export type ApplicationRequestDocument = ApplicationRequest & Document;

@Schema({ collection: 'application_requests' })
export class ApplicationRequest {
  @Prop({ required: true, ref: User.name })
  user_id: Types.ObjectId;

  @Prop({ required: true, default: ApplicantRequestStatus.PENDING })
  status: ApplicantRequestStatus;
}

export const ApplicationRequestSchema =
  SchemaFactory.createForClass(ApplicationRequest);

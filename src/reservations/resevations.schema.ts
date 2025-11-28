import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types } from 'mongoose';
import { Tool } from 'src/tools/tools.schema';
import { ReservationRequestStatus } from 'src/types/reservations';
import { User } from 'src/users/users.schema';

export type ReservationDocument = Reservation & Document;

@Schema({ versionKey: false, timestamps: true, collection: "reservations" })
export class Reservation {
  @Prop({ required: true, type: Types.ObjectId, ref: Tool.name })
  tool_id: Types.ObjectId;

  @Prop({ required: true, type: Types.ObjectId, ref: User.name })
  renter_id: Types.ObjectId;

  @Prop({ required: true, type: Date })
  start_date: Date;

  @Prop({ required: true, type: Date })
  end_date: Date;

  @Prop({
    required: true,
    default: ReservationRequestStatus.PENDING,
    enum: ReservationRequestStatus,
  })
  status: ReservationRequestStatus;

  _id: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

export const ReservationDocumentSchema =
  SchemaFactory.createForClass(Reservation);

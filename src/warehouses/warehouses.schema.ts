import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types } from 'mongoose';

export type WhareHouseDocument = WhareHouse & Document;

@Schema({ versionKey: false, timestamps: true })
export class WhareHouse {
  @Prop({ required: true })
  name: string;

  @Prop({})
  location: string;

  @Prop({})
  capacity: number;

  @Prop({ required: false })
  manager_id: Types.ObjectId;
}

export const WhareHouseSchema = SchemaFactory.createForClass(WhareHouse);

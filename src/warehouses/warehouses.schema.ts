import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types } from 'mongoose';

export type WhareHouseDocument = WhareHouse & Document;

@Schema()
export class WhareHouse {
  @Prop({ required: true })
  name: string;

  @Prop({})
  location: string;

  @Prop({})
  capacity: number;

  @Prop({ required: false })
  manager_id: Types.ObjectId;

  @Prop({ required: true, default: Date.now() })
  createdAt: Date;

  @Prop({ required: true, default: Date.now() })
  updatedAt: Date;
}

export const WhareHouseSchema = SchemaFactory.createForClass(WhareHouse);

import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type ToolDocment = Tool & Document;

export type ToolAvailability = {
  start_date: Date;
  end_date: Date;
}[];

@Schema()
export class Tool {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  owner_id: Types.ObjectId;

  @Prop({ required: true })
  category: Types.ObjectId;

  @Prop()
  description: string;

  @Prop({ required: true })
  condition: string;

  @Prop({ required: true })
  thumbnail: string;

  @Prop({ required: true })
  images: string[];

  @Prop({ required: true })
  price: number;

  @Prop({ required: true })
  availability: ToolAvailability;

  @Prop()
  location: Types.ObjectId;
}

export const ToolDocumentSchema = SchemaFactory.createForClass(Tool);

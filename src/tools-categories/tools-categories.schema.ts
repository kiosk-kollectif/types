import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type ToolsCategoriesDocument = ToolsCategories & Document;

@Schema({ collection: 'tools-categories', versionKey: false })
export class ToolsCategories {
  @Prop({ required: true, unique: true })
  name!: string;

  @Prop({ required: false })
  description?: string;

  _id!: Types.ObjectId;
}

export const ToolsCategoriesSchema =
  SchemaFactory.createForClass(ToolsCategories);

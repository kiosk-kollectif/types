import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type ToolsCategoriesDocument = ToolsCategories & Document;

@Schema()
export class ToolsCategories {
  @Prop({ required: true, unique: true })
  name: string;

  @Prop({ required: false })
  description?: string;
}

export const ToolsCategoriesSchema =
  SchemaFactory.createForClass(ToolsCategories);

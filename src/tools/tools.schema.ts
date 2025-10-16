import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { ToolRequestStatus } from 'src/common/enums/tool-request-status.enum';
import { ToolsCategories } from 'src/tools-categories/tools-categories.schema';
import { User } from 'src/users/users.schema';
import { WhareHouse } from 'src/warehouses/warehouses.schema';

export type ToolDocment = Tool & Document;

@Schema({ timestamps: true, versionKey: false })
export class Tool {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true, ref: User.name, type: Types.ObjectId })
  owner_id: Types.ObjectId;

  @Prop({ required: true, ref: ToolsCategories.name, type: Types.ObjectId })
  category: Types.ObjectId;

  @Prop()
  description: string;

  @Prop({ required: true })
  thumbnail: string;

  @Prop({ required: true })
  images: string[];

  @Prop({ required: false })
  price: number;

  @Prop({ ref: WhareHouse.name })
  location: Types.ObjectId;

  @Prop({ enum: ToolRequestStatus, default: ToolRequestStatus.PENDING })
  status: ToolRequestStatus;

  @Prop({ required: true })
  slug: string;
}

export const ToolDocumentSchema = SchemaFactory.createForClass(Tool);

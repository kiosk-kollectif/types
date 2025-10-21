import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { ToolRequestStatus } from 'src/common/enums/tool-request-status.enum';
import { ToolsCategories } from 'src/tools-categories/tools-categories.schema';
import {
  getUserPublicProfil,
  User,
  UserPublicInfo,
} from 'src/users/users.schema';
import { WhareHouse } from 'src/warehouses/warehouses.schema';

export type ToolDocument = Tool &
  Document & { getPublicInfo: () => ToolPublicInfo };

export type ToolPublicInfo = {
  name: string;
  description: string;
  thumbnail: string;
  categories: string[];
  images: string[];
  dayprice: number;
  location?: string;
  slug: string;
  owner?: UserPublicInfo;
};

@Schema({ timestamps: true, versionKey: false })
export class Tool {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true, ref: User.name, type: Types.ObjectId })
  owner_id: Types.ObjectId;

  @Prop({
    required: true,
    ref: ToolsCategories.name,
    type: [Types.ObjectId],
  })
  categories: Types.ObjectId[];

  @Prop()
  description: string;

  @Prop({ required: true })
  thumbnail: string;

  @Prop({ required: true })
  images: string[];

  @Prop({ required: false })
  dayprice: number;

  @Prop({ ref: WhareHouse.name })
  location: Types.ObjectId;

  @Prop({ enum: ToolRequestStatus, default: ToolRequestStatus.PENDING })
  status: ToolRequestStatus;

  @Prop({ required: true })
  slug: string;
}

export const ToolDocumentSchema = SchemaFactory.createForClass(Tool);

function getToolsPublicInfo(this: ToolDocument): ToolPublicInfo {
  const categories: string[] = [];

  if (Array.isArray(this.categories)) {
    this.categories.forEach((cat: unknown) => {
      if (
        typeof cat == 'object' &&
        cat !== null &&
        'name' in cat &&
        typeof cat.name == 'string'
      ) {
        categories.push(cat.name);
      }
    });
  }

  let location: string | undefined = undefined;

  if (
    this.location &&
    typeof this.location == 'object' &&
    'name' in this.location &&
    typeof this.location.name == 'string'
  ) {
    location = this.location.name;
  }

  let owner: UserPublicInfo | undefined = undefined;

  if (this.owner_id && typeof this.owner_id == 'object') {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    owner = getUserPublicProfil.call(this.owner_id);
  }

  return {
    name: this.name,
    description: this.description,
    thumbnail: this.thumbnail,
    categories,
    images: this.images,
    dayprice: this.dayprice,
    slug: this.slug,
    location,
    owner,
  };
}

ToolDocumentSchema.methods.getPublicInfo = getToolsPublicInfo;

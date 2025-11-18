import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { slugify } from 'src/common/utils/slugify';
import { ToolsCategories } from 'src/tools-categories/tools-categories.schema';
import { ToolPublicInfo, ToolRequestStatus, UserPublicInfo } from 'src/types';
import { getUserPublicProfil, User } from 'src/users/users.schema';
import { WhareHouse } from 'src/warehouses/warehouses.schema';
import { Tool as ToolInfo } from 'src/types';

export type ToolDocument = Tool &
  Document & { getPublicInfo: () => ToolPublicInfo; getInfo: () => ToolInfo };

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
  price: number;

  @Prop({ required: false })
  dayprice: number;

  @Prop({ ref: WhareHouse.name })
  location: Types.ObjectId;

  @Prop({ enum: ToolRequestStatus, default: ToolRequestStatus.PENDING })
  status: ToolRequestStatus;

  @Prop({ unique: true })
  slug: string;

  _id: Types.ObjectId;
}

export const ToolDocumentSchema = SchemaFactory.createForClass(Tool);

ToolDocumentSchema.pre('save', function (next) {
  if (this.isModified('name')) {
    this.slug = slugify(this.name);
  }
  next();
});

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

  let owner!: UserPublicInfo;

  if (this.owner_id && typeof this.owner_id == 'object') {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    owner = getUserPublicProfil.call(this.owner_id);
  }

  return {
    id: this._id.toString(),
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

function getToolInfo(this: ToolDocument): ToolInfo {
  const categories: { name: string; id: string }[] = [];

  if (this.categories && Array.isArray(this.categories)) {
    for (const categorie of this.categories) {
      if (
        typeof categorie == 'object' &&
        'name' in categorie &&
        '_id' in categorie &&
        typeof categorie.name == 'string' &&
        (typeof categorie._id == 'string' ||
          categorie._id instanceof Types.ObjectId)
      ) {
        categories.push({ name: categorie.name, id: String(categorie._id) });
      }
    }
  }

  return {
    ...this.getPublicInfo(),
    price: this.price,
    status: this.status,
    categories,
  };
}

ToolDocumentSchema.methods.getPublicInfo = getToolsPublicInfo;
ToolDocumentSchema.methods.getInfo = getToolInfo;

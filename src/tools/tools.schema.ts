import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Model, PipelineStage, Types } from 'mongoose';
import { slugify } from 'src/common/utils/slugify';
import { ToolsCategories } from 'src/tools-categories/tools-categories.schema';
import { ToolRequestStatus } from 'src/types';
import { User } from 'src/users/users.schema';
import { WhareHouse } from 'src/warehouses/warehouses.schema';

export type ToolDocument = Tool & Document;

export type ToolModel = Model<ToolDocument> & {
  findAndJoin: typeof findAndJoin;
};

@Schema({ timestamps: true, versionKey: false, collection: 'tools' })
export class Tool {
  @Prop({ required: true, ref: User.name, type: Types.ObjectId })
  owner_id!: Types.ObjectId;

  @Prop({
    required: true,
    ref: ToolsCategories.name,
    type: [Types.ObjectId],
  })
  categories!: Types.ObjectId[];

  @Prop({ required: true })
  name!: string;

  @Prop()
  description!: string;

  @Prop({ required: true })
  thumbnail!: string;

  @Prop({ required: true })
  images!: string[];

  @Prop({ required: false })
  price?: number;

  @Prop({ required: false })
  dayprice?: number;

  @Prop({ ref: WhareHouse.name })
  location?: Types.ObjectId;

  @Prop({ enum: ToolRequestStatus, default: ToolRequestStatus.PENDING })
  status!: ToolRequestStatus;

  @Prop({ unique: true })
  slug!: string;

  _id!: Types.ObjectId;
  createdAt!: Date;
  updatedAt!: Date;
}

export const ToolDocumentSchema = SchemaFactory.createForClass(Tool);

ToolDocumentSchema.pre('save', function (next) {
  if (this.isModified('name')) {
    this.slug = slugify(this.name);
  }
  next();
});

function findAndJoin(
  this: Model<ToolDocument>,
  ...piplineStages: PipelineStage[]
) {
  return this.aggregate([
    {
      $lookup: {
        from: 'reservations',
        localField: '_id',
        foreignField: 'tool_id',
        as: 'reservations',
      },
    },
    {
      $lookup: {
        from: 'tools-categories',
        localField: 'categories',
        foreignField: '_id',
        as: 'categories',
      },
    },
    {
      $lookup: {
        from: 'warehouses',
        localField: 'location',
        foreignField: '_id',
        as: 'location',
      },
    },
    { $unwind: { path: '$location', preserveNullAndEmptyArrays: true } },
    {
      $lookup: {
        from: 'users',
        localField: 'owner_id',
        foreignField: '_id',
        as: 'owner_id',
      },
    },
    { $unwind: { path: '$owner_id', preserveNullAndEmptyArrays: true } },
    ...piplineStages,
  ]);
}

(ToolDocumentSchema.statics as unknown as ToolModel).findAndJoin = findAndJoin;

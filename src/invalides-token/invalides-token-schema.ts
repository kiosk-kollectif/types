import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types } from 'mongoose';

export type InvalideTokenDocument = InvalideTokens & Document;

@Schema({ versionKey: false, timestamps: true, collection: 'invalide-tokens' })
export class InvalideTokens {
  @Prop({ type: String, required: true })
  token: string;

  _id: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

export const InvalideTokensSchema =
  SchemaFactory.createForClass(InvalideTokens);

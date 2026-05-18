import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type SettingsDocument = Settings & Document;

@Schema({ versionKey: false, timestamps: true, collection: 'settings' })
export class Settings {
  @Prop({ required: true, default: 0.2 })
  commissionRate!: number;
}

export const SettingsSchema = SchemaFactory.createForClass(Settings);

import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { UserRole } from 'src/types';

export type UserDocument = User & Document;
export type UserProfilDocument = UserProfil & Document;

@Schema({ versionKey: false, _id: false })
export class UserProfil {
  @Prop({ default: undefined })
  firstname?: string;

  @Prop({ default: undefined })
  lastname?: string;

  @Prop({ default: undefined })
  adress?: string;

  @Prop({ default: undefined })
  phone?: string;

  @Prop({ default: undefined })
  picture?: string;

  @Prop({ default: undefined })
  thumbnail?: string;
}

export const UserProfilSchema = SchemaFactory.createForClass(UserProfil);

@Schema({ versionKey: false, timestamps: true })
export class User {
  @Prop({ required: true })
  username!: string;

  @Prop({ unique: true, required: true })
  email!: string;

  @Prop({ required: true, default: false })
  active!: boolean;

  @Prop({ required: true })
  passwordHash!: string;

  @Prop({ type: UserProfilSchema })
  profil?: UserProfil;

  @Prop({ required: true, default: UserRole.USER, enum: UserRole })
  role!: UserRole;

  @Prop({ required: true, default: false })
  verified!: boolean;

  _id!: Types.ObjectId;
  createdAt!: Date;
  updatedAt!: Date;
}

export const UserSchema = SchemaFactory.createForClass(User);

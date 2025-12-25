import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { UserPublicInfo, UserRole, User as UserInfo } from '../types';

export type UserDocument = User &
  Document & {
    getUserPublicProfil: typeof getUserPublicProfil;
    getUserProfil: typeof getUserProfil;
  };
export type UserProfilDocument = UserProfil & Document;

@Schema({ versionKey: false })
export class UserProfil {
  @Prop({ required: true })
  firstname?: string;

  @Prop({ required: true })
  lastname?: string;

  @Prop({ default: undefined })
  adress?: string;

  @Prop({ default: undefined })
  phone?: string;

  @Prop({ default: undefined })
  picture?: string;

  @Prop({ default: undefined })
  thumbnail?: string;

  _id: Types.ObjectId;
}

export const UserProfilSchema = SchemaFactory.createForClass(UserProfil);

@Schema({ versionKey: false, timestamps: true })
export class User {
  @Prop({ required: true })
  username: string;

  @Prop({ unique: true, required: true })
  email: string;

  @Prop({ required: true, default: false })
  active: boolean;

  @Prop({ required: true })
  passwordHash: string;

  @Prop({ type: UserProfilSchema })
  profil: UserProfil;

  @Prop({ required: true, default: UserRole.USER, enum: UserRole })
  role: UserRole;

  @Prop({ required: true, default: false })
  verified: boolean;

  _id: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

export const UserSchema = SchemaFactory.createForClass(User);

export function getUserPublicProfil(this: UserDocument): UserPublicInfo {
  const memberSince = (
    this.createdAt instanceof Date ? this.createdAt : new Date(this.createdAt)
  ).toLocaleDateString('fr-FR', {
    month: 'long',
    year: 'numeric',
  });

  return {
    id: this._id.toString(),
    username: this.username,
    email: this.email,
    role: this.role,
    verified: this.verified,
    profil: this.profil
      ? {
          picture: this.profil?.picture,
          thumbnail: this.profil?.thumbnail,
        }
      : undefined,
    memberSince,
  };
}

UserSchema.methods.getUserPublicProfil = getUserPublicProfil;

export function getUserProfil(this: UserDocument): UserInfo {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  const info = getUserPublicProfil.call(this);
  // eslint-disable-next-line @typescript-eslint/no-unsafe-return
  return {
    active: this.active,
    ...info,
    profil: this.profil
      ? {
          firstname: this.profil.firstname,
          lastname: this.profil.lastname,
          adress: this.profil.adress,
          phone: this.profil.phone,
          picture: this.profil.picture,
          thumbnail: this.profil.thumbnail,
        }
      : undefined,
    createdAt: this.createdAt.toISOString(),
  };
}

UserSchema.methods.getUserProfil = getUserProfil;

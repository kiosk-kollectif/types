import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { Role } from 'src/common/enums/role.enum';

export type UserDocument = User &
  Document & { getUserPublicProfil: typeof getUserPublicProfil };
export type UserProfilDocument = UserProfil & Document;

export type UserPublicInfo = {
  id: Types.ObjectId;
  username: string;
  email: string;
  role: Role;
  verified: boolean;
  profil?: {
    picture?: string;
    thumbnail?: string;
  };
  memberSince: string;
};

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

  @Prop({ required: true })
  passwordHash: string;

  @Prop({ type: UserProfilSchema })
  profil: UserProfil;

  @Prop({ required: true, default: Role.USER, enum: Role })
  role: Role;

  @Prop({ required: true, default: false })
  verified: boolean;

  _id: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

export const UserSchema = SchemaFactory.createForClass(User);

export function getUserPublicProfil(this: UserDocument): UserPublicInfo {
  const memberSince = this.createdAt.toLocaleDateString('fr-FR', {
    month: 'long',
    year: 'numeric',
  });

  return {
    id: this._id,
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

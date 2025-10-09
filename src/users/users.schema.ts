import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { Role } from 'src/common/enums/role.enum';

export type UserDocument = User & Document;
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
}

export const UserSchema = SchemaFactory.createForClass(User);
UserSchema.set('toJSON', {
  transform: (_, ret) => {
    return {
      id: ret._id,
      username: ret.username,
      email: ret.email,
      role: ret.role,
      verified: ret.verified,
      profil: ret.profil
        ? {
            picture: ret.profil?.picture,
            thumbnail: ret.profil?.thumbnail,
          }
        : undefined,
    };
  },
});

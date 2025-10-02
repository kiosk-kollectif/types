import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { Role } from 'src/common/enums/role.enum';

export type UserDocument = User & Document;
export type UserProfilDocument = UserProfil & Document;

@Schema()
export class UserProfil {
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

@Schema()
export class User {
  @Prop({ required: true })
  firstname: string;

  @Prop({ required: true })
  lastname: string;

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

  @Prop({ required: true, default: Date.now() })
  createdAt: Date;

  @Prop({ required: true, default: Date.now() })
  updatedAt: Date;
}

export const UserSchema = SchemaFactory.createForClass(User);

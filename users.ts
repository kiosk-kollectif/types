import { Types } from 'mongoose';

export type UserPublicInfo = {
  id: Types.ObjectId;
  username: string;
  email: string;
  role: UserRole;
  verified: boolean;
  profil?: {
    picture?: string;
    thumbnail?: string;
  };
  memberSince: string;
};

export enum UserRole {
  ADMIN = 'admin',
  MANAGER = 'gestionnaire',
  APPLICANT = 'deposant',
  USER = 'utilisateur',
}

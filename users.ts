import { ToolPublicInfo } from './tools';

export type UserPublicInfo = {
  id: string;
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

export type User = UserPublicInfo & {
  profil?: {
    firstname?: string;
    lastname?: string;
    phone?: string;
    adress?: string;
  };
};

export type UserStats = {
  rentalsTools: { tools?: ToolPublicInfo[]; length: number };
  total_rentedd_tools: { tools?: ToolPublicInfo[]; length: number };
};

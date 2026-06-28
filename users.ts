import { Reservation } from './reservations';
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

export type User = Omit<UserPublicInfo, 'profil'> & {
  active: boolean;
  profil?: {
    picture?: string;
    thumbnail?: string;
    firstname?: string;
    lastname?: string;
    phone?: string;
    adress?: string;
  };
  createdAt: string;
};

export type UserStats = {
  totalRentCount: number;
  currentRentCount: number;
  currentRentals: (Omit<Reservation, 'tool' | 'renter'> & {
    tool: ToolPublicInfo;
  })[];
  lastEndedRentals: (Omit<Reservation, 'tool' | 'renter'> & {
    tool: ToolPublicInfo;
  })[];
};

import { type UserPublicInfo, type User } from './users';

export enum ToolRequestStatus {
  PENDING = 'pending',
  ACCEPTED = 'accepted',
  REJECTED = 'rejected',
  DEPOSED = 'deposited',
}

export type ToolPublicInfo = {
  id: string;
  name: string;
  description: string;
  thumbnail: string;
  categories: string[];
  images: string[];
  dayprice: number;
  location?: string;
  slug: string;
  owner: UserPublicInfo;
  isCurrentlyAvailable?: boolean;
};

export type ToolPublicInfoWithReservations = ToolPublicInfo & {
  reservations: string[][];
};

export type ToolRequestInfo = {
  id: string;
  name: string;
  description: string | null;
  thumbnail: string;
  images: string[];
  price: number | null;
  status: ToolRequestStatus;
  adminNote: string | null;
  owner: User;
  createdAt: string;
};

export type Tool = Omit<ToolPublicInfo, 'categories' | 'owner'> & {
  owner: User;
  price: number;
  categories: { name: string; id: string }[];
  createdAt: string;
};

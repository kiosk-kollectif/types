import { type UserPublicInfo } from './users';

export enum ToolRequestStatus {
  PENDING = 'pending',
  ACCEPTED = 'accepted',
  REJECTED = 'rejected',
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
  owner: UserPublicInfo;
  createdAt: string;
};

export type Tool = Omit<ToolPublicInfo, 'categories'> & {
  price: number;
  categories: { name: string; id: string }[];
  createdAt: string;
};

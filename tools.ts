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

export type Tool = Omit<ToolPublicInfo, 'categories'> & {
  status: ToolRequestStatus;
  price: number;
  categories: { name: string; id: string }[];
};

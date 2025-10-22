import { type UserPublicInfo } from './users.ts';

export enum ToolRequestStatus {
  PENDING = 'pending',
  ACCEPTED = 'accepted',
  REJECTED = 'rejected',
}

export type ToolPublicInfo = {
  name: string;
  description: string;
  thumbnail: string;
  categories: string[];
  images: string[];
  dayprice: number;
  location?: string;
  slug: string;
  owner: UserPublicInfo;
};

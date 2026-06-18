import { User } from './users';

export enum ApplicantRequestStatus {
  PENDING = 'pending',
  ACCEPTED = 'accepted',
  REFUSED = 'rejected',
}

export interface ApplicantRequest {
  id: string;
  userId: string;
  user: User;
  status: ApplicantRequestStatus;
  adminNote?: string | null;
  createdAt: string;
  updatedAt: string;
}

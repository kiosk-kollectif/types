import { ApiGlobalResponse } from './ApiGlobalResponse';
import { PaginatedResult } from './pagination.types';
import { Reservation } from './reservations';
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

export type GetAppplicantToolRentalResponse = PaginatedResult<
  Reservation & {
    days: number;
    earnings: number;
  }
> & {
  stats: {
    totalEarnings: number;
    totalRentedTools: number;
    uniqueRentedTools: number;
    totalOwnedTools: number;
    rentalRatio: number;
  };
};

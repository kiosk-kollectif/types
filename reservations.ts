import { ToolPublicInfo } from './tools';
import { User } from './users';

export enum ReservationRequestStatus {
  PENDING = 'en cours',
  ACCEPTED = 'acceptee',
  COMPLETED = 'terminee',
  CANCELLED = 'annulee',
}

export interface Reservation {
  id: string;
  tool: ToolPublicInfo;
  renter: User;
  start_date: string;
  end_date: string;
  status: ReservationRequestStatus;
  createdAt: string;
}

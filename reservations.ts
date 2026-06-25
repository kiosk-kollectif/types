import { Tool } from './tools';
import { User } from './users';

export enum ReservationRequestStatus {
  PENDING = 'pending',
  ACCEPTED = 'accepted',
  PICKED_UP = 'picked_up',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled',
}

export interface Reservation {
  id: string;
  tool: Tool;
  renter: User;
  start_date: string;
  end_date: string;
  status: ReservationRequestStatus;
  createdAt: string;
}

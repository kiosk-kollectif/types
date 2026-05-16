import { ToolPublicInfo } from "./tools";
import { UserPublicInfo } from "./users";

export enum ReservationRequestStatus {
  PENDING = 'en cours',
  ACCEPTED = 'acceptee',
  COMPLETED = 'terminee',
  CANCELLED = 'annulee',
}

export interface Reservation {
  id: string;
  tool: ToolPublicInfo;
  renter: UserPublicInfo;
  start_date: string;
  end_date: string;
  status: ReservationRequestStatus;
  createdAt: string;
}

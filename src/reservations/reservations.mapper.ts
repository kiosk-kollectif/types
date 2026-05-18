import { Reservation } from './resevations.schema';
import {
  Reservation as ReservationType,
  ReservationRequestStatus,
} from '../types';
import { mapToolToPublicInfo, PopulatedTool } from '../tools/tools.mapper';
import { mapUserToInfo } from '../users/users.mapper';
import { User } from '../users/users.schema';

export interface PopulatedReservation
  extends Omit<Reservation, 'tool_id' | 'renter_id'> {
  tool_id: PopulatedTool;
  renter_id: User;
}

export const mapReservationToType = (
  doc: PopulatedReservation,
): ReservationType => {
  return {
    id: doc._id.toString(),
    tool: mapToolToPublicInfo(doc.tool_id),
    renter: mapUserToInfo(doc.renter_id),
    start_date: doc.start_date.toISOString(),
    end_date: doc.end_date.toISOString(),
    status: doc.status as unknown as ReservationRequestStatus,
    createdAt: doc.createdAt.toISOString(),
  };
};

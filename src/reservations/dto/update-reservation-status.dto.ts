import { IsEnum, IsOptional, IsString } from 'class-validator';
import { ReservationRequestStatus } from 'src/types';

export class UpdateReservationStatusDto {
  @IsEnum(ReservationRequestStatus)
  status: ReservationRequestStatus;

  @IsOptional()
  @IsString()
  note?: string;
}

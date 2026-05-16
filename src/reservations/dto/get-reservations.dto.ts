import { IsEnum, IsOptional, IsString } from 'class-validator';
import { ReservationRequestStatus } from 'src/types';

export class GetReservationsDto {
  @IsOptional()
  @IsString()
  page?: string;

  @IsOptional()
  @IsString()
  limit?: string;
  
  @IsOptional()
  @IsString()
  search?: string;

  @IsOptional()
  @IsEnum(ReservationRequestStatus)
  status?: ReservationRequestStatus;
}

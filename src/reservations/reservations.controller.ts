import { Body, Controller, HttpStatus, Post } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiConflictResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { PermissionLevel } from 'src/common/decorator/permission-level.decorator';
import { ApiGlobalResponse } from 'src/common/types';
import { UserRole } from 'src/types';
import { User } from 'src/users/users.decorator';
import type { UserDocument } from 'src/users/users.schema';
import { PostReservationDto } from './dto/post-reservation.dto';
import { ReservationsService } from './reservations.service';

@ApiTags("Reservations d'outils")
@Controller('reservations')
export class ReservationsController {
  constructor(private readonly reservationsService: ReservationsService) {}

  @Post()
  @PermissionLevel(Object.values(UserRole))
  @ApiOperation({ summary: 'Reserver un outils' })
  @ApiConflictResponse({
    description: 'Conflits au niveau de la periode de reservations',
  })
  @ApiBadRequestResponse({ description: 'Les données envoyées sont invalides' })
  // @UseGuards(JwtAuthGuard)
  async createReservation(
    @User() user: UserDocument,
    @Body() reservations: PostReservationDto,
  ): Promise<ApiGlobalResponse> {
    await this.reservationsService.postReservations(user, reservations);

    return {
      StatusCode: HttpStatus.CREATED,
      message: 'Reservation created',
    };
  }
}

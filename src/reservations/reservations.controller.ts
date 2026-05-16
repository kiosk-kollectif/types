import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
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
import { GetReservationsDto } from './dto/get-reservations.dto';
import { UpdateReservationStatusDto } from './dto/update-reservation-status.dto';

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

  @Get()
  @PermissionLevel([UserRole.ADMIN, UserRole.MANAGER])
  @ApiOperation({ summary: 'Lister toutes les reservations (Admin)' })
  async findAll(@Query() query: GetReservationsDto) {
    const data = await this.reservationsService.findAll({
      page: query.page ? parseInt(query.page) : undefined,
      limit: query.limit ? parseInt(query.limit) : undefined,
      search: query.search,
      status: query.status,
    });

    return {
      StatusCode: HttpStatus.OK,
      message: 'Reservations fetched',
      data,
    };
  }

  @Patch(':id/status')
  @PermissionLevel([UserRole.ADMIN, UserRole.MANAGER])
  @ApiOperation({
    summary: 'Mettre a jour le statut d une reservation (Admin)',
  })
  async updateStatus(
    @Param('id') id: string,
    @Body() body: UpdateReservationStatusDto,
  ) {
    await this.reservationsService.updateStatus(id, body.status, body.note);

    return {
      StatusCode: HttpStatus.OK,
      message: 'Reservation status updated',
    };
  }
}

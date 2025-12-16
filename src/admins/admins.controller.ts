import { Controller, Get, HttpStatus, Param, Query } from '@nestjs/common';
import { PermissionLevel } from 'src/common/decorator/permission-level.decorator';
import { UserRole } from 'src/types';
import { AdminsService } from './admins.service';
import { ApiOkResponse, ApiOperation } from '@nestjs/swagger';

@Controller('admins')
export class AdminsController {
  constructor(private readonly adminsService: AdminsService) {}

  @PermissionLevel([UserRole.ADMIN, UserRole.MANAGER])
  @Get('review-queue')
  @ApiOperation({ summary: "Recuperer les requests en cours d'attentes" })
  @ApiOkResponse({ description: 'Listes des requetes en cours' })
  async getReviewQueue(
    @Query('page') page: string = '1',
    @Query('limit') limit: string = '10',
  ) {
    return await this.adminsService.getReviewQueue(
      parseInt(page),
      parseInt(limit),
    );
  }

  @PermissionLevel([UserRole.ADMIN, UserRole.MANAGER])
  @Get('/users/:id/stats')
  async getUserStats(@Param('id') id: string) {
    const stats = await this.adminsService.getUsersStats(id);

    return {
      StatusCode: HttpStatus.OK,
      message: 'success',
      data: { ...stats },
    };
  }
}

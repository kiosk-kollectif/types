import { Controller, Get, Query } from '@nestjs/common';
import { PermissionLevel } from 'src/common/decorator/permission-level.decorator';
import { UserRole } from 'src/types';
import { AdminsService } from './admins.service';

@Controller('admins')
export class AdminsController {
  constructor(private readonly adminsService: AdminsService) {}

  @PermissionLevel([UserRole.ADMIN, UserRole.MANAGER])
  @Get('review-queue')
  async getReviewQueue(
    @Query('page') page: string = '1',
    @Query('limit') limit: string = '10',
  ) {
    return await this.adminsService.getReviewQueue(
      parseInt(page),
      parseInt(limit),
    );
  }
}

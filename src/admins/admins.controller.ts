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
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
  ) {
    return await this.adminsService.getReviewQueue(page, limit);
  }
}

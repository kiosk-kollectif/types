import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Param,
  Post,
  Query,
} from '@nestjs/common';
import { PermissionLevel } from 'src/common/decorator/permission-level.decorator';
import { UserRole } from 'src/types';
import { AdminsService } from './admins.service';
import { ApiOkResponse, ApiOperation } from '@nestjs/swagger';
import { UpdateUserDto } from './dto/update-user.dto';

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

  // Potentiels requetes sur l'utilisateurs
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

  @PermissionLevel([UserRole.ADMIN, UserRole.MANAGER])
  @Post('/users/:id/update')
  @ApiOperation({ summary: "mettre a jour les donnees d'un utilisateur" })
  async updateUser(@Param('id') id: string, @Body() body: UpdateUserDto) {
    const user = await this.adminsService.updateUser(id, body);
    return {
      StatusCode: HttpStatus.OK,
      message: 'success',
      data: { user },
    };
  }

  // Potentiels requetes sur les outils
  @Get('/tools/:id/stats')
  async getToolsStats(@Param('id') id: string) {
    const stats = await this.adminsService.getToolsStats(id);
    return {
      StatusCode: HttpStatus.OK,
      message: 'nice bro',
      data: { ...stats },
    };
  }
}

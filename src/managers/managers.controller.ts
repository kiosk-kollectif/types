import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Query,
} from '@nestjs/common';
import { ManagersService } from './managers.service';
import { UsersService } from 'src/users/users.service';
import { CreateManagerDto } from './dto/create-manager.dto';
import { UpdateManagerDto } from './dto/update-manager.dto';
import { GetUsersQueryRequestDto } from 'src/users/dto/get-users.dto';
import { PermissionLevel } from 'src/common/decorator/permission-level.decorator';
import { UserRole } from 'src/types';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { ResponseMessage } from 'src/common/decorator/response-message.decorator';

@ApiTags('Managers Management')
@Controller('managers')
export class ManagersController {
  constructor(
    private readonly managersService: ManagersService,
    private readonly usersService: UsersService,
  ) {}

  @Post()
  @PermissionLevel([UserRole.ADMIN])
  @ResponseMessage('Manager créé avec succès')
  @ApiOperation({ summary: 'Créer un nouveau manager (Admin uniquement)' })
  create(@Body() createManagerDto: CreateManagerDto) {
    return this.managersService.create(createManagerDto);
  }

  @Get()
  @PermissionLevel([UserRole.ADMIN])
  @ResponseMessage('Liste des managers récupérée')
  @ApiOperation({ summary: 'Lister tous les managers (Admin uniquement)' })
  findAll(@Query() query: GetUsersQueryRequestDto) {
    return this.usersService.getUsers(query, [UserRole.MANAGER]);
  }

  @Patch(':id')
  @PermissionLevel([UserRole.ADMIN])
  @ResponseMessage('Manager mis à jour avec succès')
  @ApiOperation({ summary: 'Mettre à jour un manager (Admin uniquement)' })
  update(@Param('id') id: string, @Body() updateManagerDto: UpdateManagerDto) {
    return this.managersService.update(id, updateManagerDto);
  }
}

import { Body, Controller, Get, HttpStatus, Param, Post } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AddWarehouseDto } from './dto/add-warehouse.dto';
import { WarehousesService } from './warehouses.service';
import { PermissionLevel } from 'src/common/decorator/permission-level.decorator';
import { UserRole } from 'src/types';

@ApiTags('Conteneurs')
@Controller('warehouses')
export class WarehousesController {
  constructor(private readonly wareHouseServ: WarehousesService) {}

  @PermissionLevel([UserRole.ADMIN])
  @Post('add')
  @ApiOperation({ summary: 'Ajouter un conteneur' })
  @ApiResponse({ status: 200, description: 'Conteneur ajouté avec succès' })
  @ApiResponse({
    status: 400,
    description: 'Erreur; identifiant manquant',
  })
  async addWareHouse(@Body() house: AddWarehouseDto) {
    const newHouse = await this.wareHouseServ.addWareHouse(house);

    return {
      StatusCode: HttpStatus.CREATED,
      message: 'Conteneur ajouté avec succès',
      data: newHouse,
    };
  }

  @PermissionLevel([UserRole.ADMIN, UserRole.MANAGER])
  @Get(':id')
  @ApiOperation({ summary: 'Afficher un conteneur' })
  @ApiResponse({ status: 200, description: 'Conteneur affiché avec succès' })
  @ApiResponse({
    status: 404,
    description: 'Erreur; conteneur non trouvé',
  })
  async getWareHouse(@Param('id') id: string) {
    const house = await this.wareHouseServ.getWareHouseById(id);

    return {
      StatusCode: HttpStatus.OK,
      message: 'Conteneur affiché avec succès',
      data: house,
    };
  }

  @PermissionLevel([UserRole.ADMIN])
  @Get(':id/delete')
  @ApiOperation({ summary: 'Supprimer un conteneur' })
  deleteWareHouse() {
    //TODO: Implementer deleteWareHouse
  }

  @PermissionLevel([UserRole.ADMIN])
  @Post(':id/update')
  @ApiOperation({ summary: 'Modifier un conteneur' })
  @ApiResponse({ status: 200, description: 'Conteneur modifié avec succès' })
  @ApiResponse({
    status: 400,
    description: 'Erreur; identifiant manquant',
  })
  @ApiResponse({
    status: 404,
    description: 'Erreur; conteneur non trouvé',
  })
  async updateWareHouse(
    @Param('id') id: string,
    @Body() house: Partial<AddWarehouseDto>,
  ) {
    const newHouse = await this.wareHouseServ.editWareHouse(id, house);

    return {
      StatusCode: HttpStatus.OK,
      message: 'Conteneur modifié avec succès',
      data: newHouse,
    };
  }
}

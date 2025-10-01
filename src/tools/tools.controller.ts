import {
  Body,
  Controller,
  Delete,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import {
  ApiBadRequestResponse,
  ApiCreatedResponse,
  ApiNotFoundResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { CreateToolDto } from './dto/create-tool.dto';
import { ToolsService } from './tools.service';
import { Tool } from './tools.schema';
import { Role } from 'src/common/enums/role.enum';
import { PermissionLevel } from 'src/common/decorator/permission-level.decorator';

@ApiTags('Tools')
@Controller('tools')
export class ToolsController {
  constructor(private readonly toolsService: ToolsService) {}
  async getToolById() {}

  @Post('/')
  @PermissionLevel([Role.ADMIN, Role.MANAGER, Role.APPLICANT])
  @ApiOperation({ summary: 'Creer un nouvel outils' })
  @ApiCreatedResponse({
    description: "l'outils a ete cree",
    example: {
      StatusCode: 201,
      Message: 'Tool created successfully',
      datac: { Tool },
    },
  })
  @ApiBadRequestResponse({ description: 'Parametres manquants' })
  @ApiNotFoundResponse({
    description: "l'utilisateur n'existe pas ou la categorie est inexistante",
  })
  @UseInterceptors(FilesInterceptor('images'))
  async createTool(
    @Body() createToolDto: CreateToolDto,
    @UploadedFiles() images: Express.Multer.File[],
  ) {
    const tool = await this.toolsService.CreateTool(createToolDto, images);

    return {
      StatusCode: HttpStatus.CREATED,
      Message: 'Tool created successfully',
      Data: { tool },
    };
  }

  @Delete('/:id')
  @HttpCode(HttpStatus.ACCEPTED)
  // @PermissionLevel([Role.ADMIN, Role.MANAGER, Role.APPLICANT])
  @ApiOperation({ summary: 'Supprimer un outil' })
  @ApiCreatedResponse({
    description: "l'outils a ete supprime",
  })
  @ApiBadRequestResponse({ description: 'Parametres manquants' })
  @ApiNotFoundResponse({ description: 'Item non existant' })
  async deleteTool(@Param('id') id: string) {
    const deleted = await this.toolsService.deleteItem(id);

    return {
      StatusCode: HttpStatus.ACCEPTED,
      Message: 'Tool deleted successfully',
      data: { deleted },
    };
  }
}

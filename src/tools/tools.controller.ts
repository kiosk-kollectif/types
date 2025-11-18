import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Query,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import {
  ApiBadRequestResponse,
  ApiCreatedResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { CreateToolDto } from './dto/create-tool.dto';
import { ToolsService } from './tools.service';
import { PermissionLevel } from 'src/common/decorator/permission-level.decorator';
import { User } from 'src/users/users.decorator';
import * as usersSchema from 'src/users/users.schema';
import { ToolRequestStatus, UserRole } from 'src/types';

@ApiTags('Tools')
@Controller('tools')
export class ToolsController {
  constructor(private readonly toolsService: ToolsService) {}

  @Get('/')
  @ApiOperation({ summary: 'Recuperer la liste des outils acceptes' })
  @ApiOkResponse({
    description: 'Requete valider',
    example: {
      StatusCode: HttpStatus.OK,
      Message: 'Tools retrieved successfully',
      data: {
        page: 1,
        totalPage: 1,
        tools: 'Liste des outils',
      },
    },
  })
  async getTools(
    @Query('query') query?: string,
    @Query('category') category?: string,
    @Query('page') page?: number,
    @Query('limit') limit?: number,
    @Query('status') status?: ToolRequestStatus,
  ) {
    const toolsData = await this.toolsService.getTools(
      query,
      category,
      page,
      status,
      limit,
    );

    return {
      StatusCode: HttpStatus.OK,
      Message: 'Tools retrieved successfully',
      data: { ...toolsData },
    };
  }

  @Post('/')
  @PermissionLevel([UserRole.ADMIN, UserRole.MANAGER, UserRole.APPLICANT])
  @ApiOperation({ summary: 'Creer un nouvel outils' })
  @ApiCreatedResponse({ description: "l'outils a ete cree" })
  @ApiBadRequestResponse({ description: 'Parametres manquants' })
  @ApiNotFoundResponse({
    description: "l'utilisateur n'existe pas ou la categorie est inexistante",
  })
  @UseInterceptors(FilesInterceptor('images', 5))
  async createTool(
    @Body() createToolDto: CreateToolDto,
    @UploadedFiles() images: Express.Multer.File[],
    @User() user: usersSchema.UserDocument,
  ) {
    const tool = await this.toolsService.CreateTool(
      user,
      createToolDto,
      images,
    );

    return {
      StatusCode: HttpStatus.CREATED,
      Message: 'Tool created successfully',
      data: { tool },
    };
  }

  @Post(':id/delete')
  @HttpCode(HttpStatus.ACCEPTED)
  @PermissionLevel(Object.keys(UserRole))
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

  @Post(':id/update')
  @UseInterceptors(FilesInterceptor('images', 5))
  async editTool(
    @Param('id') id: string,
    @UploadedFiles() images: Express.Multer.File[],
    @Body() createToolDto: Partial<CreateToolDto> & { images?: string[] },
    @User() user: usersSchema.UserDocument,
  ) {
    const tool = await this.toolsService.updateTool(
      id,
      createToolDto,
      user,
      images,
    );

    return {
      StatusCode: HttpStatus.ACCEPTED,
      message: 'Tool updated successfully',
      data: { tool },
    };
  }

  @Get('/slug/:slug')
  @ApiOperation({ summary: 'Recuperer un outil par son slug' })
  @ApiOkResponse({
    description: 'Requete valider',
  })
  @ApiNotFoundResponse({ description: 'Item non existant' })
  async getToolBySlug(@Param('slug') slug: string) {
    const tool = await this.toolsService.getToolBySlug(slug);

    return {
      StatusCode: HttpStatus.OK,
      Message: 'Tool retrieved successfully',
      data: { tool },
    };
  }
}

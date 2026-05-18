import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
} from '@nestjs/common';
import {
  ApiConflictResponse,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { CreateCategoryDto } from './dto/create-category.dto';
import { GlobalEditCategoryDto } from './dto/global-edit-category.dto';
import { ToolsCategoriesService } from './tools-categories.service';
import { PermissionLevel } from 'src/common/decorator/permission-level.decorator';
import { CategorieNotFoundResponse } from './tools-categories.decorator';
import { UserRole } from 'src/types';
import { ResponseMessage } from 'src/common/decorator/response-message.decorator';

@ApiTags('Gerer les categories des outils')
@Controller('tools-categories')
export class ToolsCategoriesController {
  constructor(
    private readonly toolsCategoriesService: ToolsCategoriesService,
  ) {}

  @PermissionLevel([UserRole.ADMIN])
  @Post('/global-edit')
  @ResponseMessage('Catégories mises à jour')
  @ApiOperation({
    summary: 'Mise à jour globale des catégories (ajout/suppression/édition)',
  })
  async batchUpdateCategories(@Body() dto: GlobalEditCategoryDto) {
    return await this.toolsCategoriesService.batchUpdateCategories(dto);
  }

  @PermissionLevel([UserRole.ADMIN])
  @Post('/')
  @ApiOperation({ summary: "Creer une nouvelle categorie d'outils" })
  @ApiCreatedResponse({ description: 'La categorie a ete cree avec succes' })
  @ApiConflictResponse({ description: 'La categorie existe deja' })
  async createCategory(@Body() createCategoryDto: CreateCategoryDto) {
    const newCategory =
      await this.toolsCategoriesService.createCategory(createCategoryDto);

    return {
      StatusCode: HttpStatus.CREATED,
      Message: 'La categorie a ete cree avec succes',
      data: {
        category: newCategory,
      },
    };
  }

  @Get('/')
  @ApiOperation({ summary: "Recuperer toutes les categories d'outils" })
  @ApiOkResponse({
    description: 'La liste des categories a ete recuperee avec succes',
  })
  async getAllCategories() {
    const categories = await this.toolsCategoriesService.getAllCategories();
    return {
      StatusCode: HttpStatus.OK,
      Message: 'La liste des categories a ete recuperee avec succes',
      data: {
        categories: categories.map((c) => {
          return { id: c._id, name: c.name, description: c.description };
        }),
      },
    };
  }

  @PermissionLevel([UserRole.ADMIN])
  @Delete('/:id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: "Supprimer une categorie d'outils" })
  @ApiOkResponse({
    description: 'La categorie a ete supprimee avec succes',
  })
  @CategorieNotFoundResponse()
  async deleteCategory(@Param('id') id: string) {
    await this.toolsCategoriesService.deleteCategory(id);

    return {
      StatusCode: HttpStatus.OK,
      Message: 'La categorie a ete supprimee avec succes',
    };
  }

  @PermissionLevel([UserRole.ADMIN])
  @Post(':id/edit')
  @HttpCode(HttpStatus.ACCEPTED)
  @ApiOperation({ summary: "Modifier une categorie d'outils" })
  @ApiOkResponse({
    description: 'La categorie a ete modifiee avec succes',
  })
  @CategorieNotFoundResponse()
  async updateCategory(
    @Param('id') id: string,
    @Body() categoryDto: Partial<CreateCategoryDto>,
  ) {
    const category = await this.toolsCategoriesService.updateCategory(
      id,
      categoryDto,
    );

    return {
      StatusCode: HttpStatus.ACCEPTED,
      Message: 'La categorie a ete modifiee avec succes',
      data: { category },
    };
  }
}

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
import { ToolsCategoriesService } from './tools-categories.service';
import { PermissionLevel } from 'src/common/decorator/permission-level.decorator';
import { Role } from 'src/common/enums/role.enum';
import { CategorieNotFoundResponse } from './tools-categories.decorator';

@ApiTags('Gerer les categories des outils')
@Controller('tools-categories')
export class ToolsCategoriesController {
  constructor(
    private readonly toolsCategoriesService: ToolsCategoriesService,
  ) {}

  @PermissionLevel([Role.ADMIN])
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
        categories,
      },
    };
  }

  @PermissionLevel([Role.ADMIN])
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

  @PermissionLevel([Role.ADMIN])
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

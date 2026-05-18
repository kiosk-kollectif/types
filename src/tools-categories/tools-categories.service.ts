import { ConflictException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import {
  ToolsCategories,
  ToolsCategoriesDocument,
} from './tools-categories.schema';
import { Model, Types } from 'mongoose';
import { CreateCategoryDto } from './dto/create-category.dto';
import { GlobalEditCategoryDto } from './dto/global-edit-category.dto';

@Injectable()
export class ToolsCategoriesService {
  constructor(
    @InjectModel(ToolsCategories.name)
    private readonly toolsCategoriesModel: Model<ToolsCategoriesDocument>,
  ) {}

  async getAllCategories() {
    return await this.toolsCategoriesModel.find();
  }

  async getCategoryById(id: string | Types.ObjectId) {
    const category = await this.toolsCategoriesModel.findById(id);
    if (!category) {
      throw new ConflictException('This category does not exist');
    }
    return category;
  }

  async getCategoriesById(
    id: Array<string | Types.ObjectId> | Types.ObjectId | string,
  ) {
    try {
      return await this.toolsCategoriesModel.find({
        _id: { $in: Array.isArray(id) ? id : [id] },
      });
    } catch (error) {
      throw new ConflictException('This category does not exist', {
        description: (<Error>error).message,
      });
    }
  }

  async createCategory(categoryDto: CreateCategoryDto) {
    const newCategory = {
      ...categoryDto,
      name: categoryDto.name.toLowerCase(),
    };

    const categories = await this.getAllCategories();
    const exists = categories.find((cat) => cat.name === newCategory.name);
    if (exists) {
      throw new ConflictException('This categorie exists already');
    }
    const created = await this.toolsCategoriesModel.create(newCategory);

    return created;
  }

  async deleteCategory(id: string) {
    const exist = await this.getCategoryById(id);
    await this.toolsCategoriesModel.deleteOne({ _id: exist._id });
  }

  async updateCategory(id: string, categoryDto: Partial<CreateCategoryDto>) {
    const exists = await this.getCategoryById(id);

    if (categoryDto?.name) exists.name = categoryDto.name.toLowerCase();
    if (categoryDto?.description) exists.description = categoryDto.description;

    await exists.save();
    return exists;
  }

  async batchUpdateCategories(dto: GlobalEditCategoryDto) {
    if (dto.add) {
      for (const cat of dto.add) {
        await this.createCategory(cat);
      }
    }

    if (dto.remove) {
      for (const id of dto.remove) {
        await this.deleteCategory(id);
      }
    }

    if (dto.edit) {
      for (const cat of dto.edit) {
        await this.updateCategory(cat.id, {
          name: cat.name,
          description: cat.description,
        });
      }
    }

    return await this.getAllCategories();
  }
}

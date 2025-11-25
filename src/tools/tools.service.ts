import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Tool, ToolDocument } from './tools.schema';
import { Model, RootFilterQuery, Types } from 'mongoose';
import { CreateToolDto } from './dto/create-tool.dto';
import { uploadFile } from 'src/common/utils/cloudinary';
import sharp from 'sharp';
import { ToolsCategoriesService } from 'src/tools-categories/tools-categories.service';
import { UserDocument } from 'src/users/users.schema';
import { ToolRequestStatus, UserRole, type Tool as ToolInfo } from '../types';
import { sameObjectId } from 'src/common/utils/sameObjectId';
import { GetToolByIds } from './dto/get-tools-by-ids.dto';

@Injectable()
export class ToolsService {
  constructor(
    @InjectModel(Tool.name) private readonly toolModel: Model<ToolDocument>,
    private readonly toolsCategorieServ: ToolsCategoriesService,
  ) { }

  async getTools(
    query?: string,
    category?: string,
    page: number = 1,
    status?: ToolRequestStatus,
    limit: number = 10,
  ) {
    const searchOptions: RootFilterQuery<ToolDocument> = {};
    if (query) {
      searchOptions.name = { $regex: new RegExp(query, 'i') };
    }

    if (category) {
      searchOptions.categories = { $in: [new Types.ObjectId(category)] };
    }

    const search = this.toolModel
      .find(searchOptions)
      .where({ status: ToolRequestStatus.ACCEPTED });

    if (status) {
      search.where({ status });
    }

    const total = await this.toolModel.countDocuments({
      ...searchOptions,
      status: ToolRequestStatus.ACCEPTED,
    });

    const totalPages = Math.max(1, Math.ceil(total / limit));
    const currentPage = Math.min(page, totalPages);
    const skip = (currentPage - 1) * limit;

    search.skip(skip);

    search.limit(limit);

    const tools = await search
      .populate('categories', 'name')
      .populate('location', 'name')
      .populate('owner_id');

    return {
      page: currentPage,
      totalPages,
      tools: tools.map((tool) => tool.getPublicInfo()),
    };
  }

  async CreateTool(
    user: UserDocument,
    tool: CreateToolDto,
    images: Express.Multer.File[],
  ): Promise<ToolInfo> {
    if (!tool.categories || !tool.name)
      throw new BadRequestException('Missing somes required fields');

    //Check bro's permission Level
    if (user.role == UserRole.APPLICANT) {
      if (tool.owner_id || tool.dayprice || tool.location || tool.status)
        throw new UnauthorizedException(
          "You don't have permission edit some fields",
        );

      tool.owner_id = user.id as string;

      //Case Admin adding a new tool for applicant
    } else {
      if (!tool.owner_id || !tool.location || !tool.dayprice)
        //Check if missing some required params
        throw new BadRequestException('missing some required params');
    }

    //check if categorie exist
    await this.toolsCategorieServ.getCategoriesById(tool.categories);

    if (!images || images.length === 0)
      throw new BadRequestException('at latest one image required');

    const thumbBuffer = await sharp(images[0].buffer)
      .resize({ width: 200 })
      .jpeg({ quality: 50 })
      .toBuffer();

    const thumbnail = await uploadFile(
      {
        buffer: thumbBuffer,
      } as Express.Multer.File,
      'thumbnail',
    );

    const imagesLinks = await Promise.all(
      images.map(async (image) => await uploadFile(image), 'tools'),
    );

    const newTool = await this.toolModel.create({
      ...tool,
      thumbnail,
      images: imagesLinks,
    });

    await newTool.populate('categories');

    return newTool.getInfo();
  }

  async getToolById(id: string) {
    const exist = await this.toolModel.findById(id);
    if (!exist) throw new NotFoundException('tool not found');
    return exist;
  }

  async getToolsByIds(ids: GetToolByIds) {
    if (!ids?.ids) throw new BadRequestException("Missing paramd");

    const result = await this.toolModel.find({ _id: { $in: ids.ids } })
    await Promise.all(result.map(r => r.populate("owner_id")))
    return result.map(r => r.getPublicInfo())
  }

  async deleteItem(id: string) {
    const deleted = await this.getToolById(id);
    await this.toolModel.deleteOne({ _id: deleted._id });
    return deleted;
  }

  async getToolBySlug(slug: string) {
    const tool = await this.toolModel
      .findOne({ slug })
      .populate('categories', 'name')
      .populate('location', 'name')
      .populate('owner_id');

    if (!tool) throw new NotFoundException('tool not found');
    return tool.getPublicInfo();
  }

  async updateTool(
    id: string,
    tool: Partial<CreateToolDto> & { images?: string[] },
    user: UserDocument,
    images?: Express.Multer.File[],
  ): Promise<ToolInfo> {
    //Check bro's permission Level
    if (user.role == UserRole.APPLICANT) {
      if (tool.owner_id || tool.dayprice || tool.location || tool.status)
        throw new UnauthorizedException(
          "You don't have permission edit some fields",
        );
    }

    const toolExist = await this.toolModel.findById(id);
    if (!toolExist) throw new NotFoundException('Your item is not found');
    if (!sameObjectId(toolExist.owner_id, user._id))
      throw new UnauthorizedException('You are not the owner of this tool');

    if (tool.name) toolExist.name = tool.name;
    if (tool.description) toolExist.description = tool.description;
    if (tool.dayprice) toolExist.dayprice = tool.dayprice;
    if (tool.owner_id) toolExist.owner_id = new Types.ObjectId(tool.owner_id);
    if (tool.location) toolExist.location = new Types.ObjectId(tool.location);

    if (tool.categories) {
      await this.toolsCategorieServ.getCategoriesById(tool.categories);
      toolExist.categories = tool.categories.map(
        (cat) => new Types.ObjectId(cat),
      );
    }

    if (tool.images) {
      if (!tool.images.includes(toolExist.images[0])) toolExist.thumbnail = '';
      toolExist.images = tool.images;
    } else if (!tool.images && images) {
      toolExist.thumbnail = '';
      toolExist.images = [];
    }

    if (images && images.length > 0) {
      const imagesLinks = await Promise.all(
        images.map(async (image) => await uploadFile(image), 'tools'),
      );
      toolExist.images = [...toolExist.images, ...imagesLinks];
    }

    // Cas ou le thumbnail a ete supprimer
    if (toolExist.thumbnail === '') {
      if (typeof toolExist.images[0] == 'string') {
        // TODO: trouver un moyen de compresser l'image
        toolExist.thumbnail = toolExist.images[0];
      } else {
        const thumbBuffer = await sharp(images![0].buffer)
          .resize(200)
          .jpeg()
          .toBuffer();

        const thumbnail = await uploadFile(
          {
            buffer: thumbBuffer,
          } as Express.Multer.File,
          'thumbnail',
        );
        toolExist.thumbnail = thumbnail;
      }
    }

    await toolExist.save();
    await toolExist.populate('categories');

    return toolExist.getInfo();
  }
}

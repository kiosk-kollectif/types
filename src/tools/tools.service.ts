import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Tool, ToolDocment } from './tools.schema';
import { Model, RootFilterQuery } from 'mongoose';
import { CreateToolDto } from './dto/create-tool.dto';
import { uploadFile } from 'src/common/utils/cloudinary';
import sharp from 'sharp';
import { ToolsCategoriesService } from 'src/tools-categories/tools-categories.service';
import { UserDocument } from 'src/users/users.schema';
import { Role } from 'src/common/enums/role.enum';
import { ToolsCategoriesDocument } from 'src/tools-categories/tools-categories.schema';
import { ToolRequestStatus } from 'src/common/enums/tool-request-status.enum';

@Injectable()
export class ToolsService {
  constructor(
    @InjectModel(Tool.name) private readonly toolModel: Model<ToolDocment>,
    private readonly toolsCategorieServ: ToolsCategoriesService,
  ) {}

  async getTools(
    query?: string,
    categorie?: string,
    page?: number,
    order = 'asc',
  ) {
    const searchOptions: RootFilterQuery<ToolDocment> = {};
    if (query) {
      searchOptions.name = { $regex: new RegExp(query, 'i') };
    }

    if (categorie) {
      searchOptions.category = categorie;
    }

    const search = this.toolModel
      .find(searchOptions)
      .where({ status: ToolRequestStatus.ACCEPTED });
    if (order === 'desc') {
      search.sort({ createdAt: -1 });
    }
    if (page) {
      search.skip((page - 1) * 20);
    }
    search.limit(20);

    const items = await search
      .populate(
        'owner_id',
        'firstname lastname profil.picture profil.thumbnail',
      )
      .populate('category', 'name');

    return items.map((item) => {
      return {
        ...item.toObject(),
        category: (item.category as unknown as ToolsCategoriesDocument).name,
      };
    });
  }

  async CreateTool(
    user: UserDocument,
    tool: CreateToolDto,
    images: Express.Multer.File[],
  ) {
    //Check bro's permission Level
    if (user.role == Role.APPLICANT) {
      if (tool.owner_id || tool.price || tool.location || tool.status)
        throw new UnauthorizedException(
          "You don't have permission edit some fields",
        );

      tool.owner_id = user.id as string;

      //Case Admin adding a new tool for applicant
    } else {
      if (
        !tool.name ||
        !tool.owner_id ||
        !tool.category ||
        !tool.condition ||
        !tool.location ||
        !tool.price
      )
        //Check if missing some required params
        throw new BadRequestException('missing some required params');
    }

    //check if categorie exist
    await this.toolsCategorieServ.getCategoryById(tool.category);

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

    return newTool;
  }

  async getToolById(id: string) {
    const exist = await this.toolModel.findById(id);
    if (!exist) throw new NotFoundException('tool not found');
    return exist;
  }

  async deleteItem(id: string) {
    const deleted = await this.getToolById(id);
    await this.toolModel.deleteOne({ _id: deleted._id });
    return deleted;
  }
}

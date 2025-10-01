import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Tool, ToolDocment } from './tools.schema';
import { Model } from 'mongoose';
import { CreateToolDto } from './dto/create-tool.dto';
import { uploadFile } from 'src/common/utils/cloudinary';
import sharp from 'sharp';
import { UsersService } from '../users/users.service';
import { ToolsCategoriesService } from 'src/tools-categories/tools-categories.service';

@Injectable()
export class ToolsService {
  constructor(
    @InjectModel(Tool.name) private readonly toolModel: Model<ToolDocment>,
    private readonly usersService: UsersService,
    private readonly toolsCategorieServ: ToolsCategoriesService,
  ) {}

  async CreateTool(tool: CreateToolDto, images: Express.Multer.File[]) {
    //Check if missing some required params
    if (
      !tool.name ||
      !tool.owner_id ||
      !tool.category ||
      !tool.condition ||
      !tool.location ||
      !tool.price
    )
      throw new BadRequestException('missing some required params');

    //check if user exist
    await this.usersService.getUserById(tool.owner_id);

    //check if categorie exist
    await this.toolsCategorieServ.getCategoryById(tool.category);

    if (!images || images.length === 0)
      throw new BadRequestException('at latest one image required');

    const thumbBuffer = await sharp(images[0].buffer)
      .resize({ width: 200 })
      .jpeg({ quality: 50 })
      .toBuffer();

    const thumbnail = await uploadFile({
      buffer: thumbBuffer,
    } as Express.Multer.File);

    const imagesLinks = await Promise.all(
      images.map(async (image) => await uploadFile(image)),
    );

    const newTool = await this.toolModel.create({
      ...tool,
      thumbnail,
      images: imagesLinks,
      availability: [{ start_date: Date.now(), end_date: undefined }],
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

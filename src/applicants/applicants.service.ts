import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import {
  ApplicationRequest,
  ApplicationRequestDocument,
} from './applicants.schema';
import { Model } from 'mongoose';
import { UserDocument } from 'src/users/users.schema';
import { ApplicantRequestStatus } from 'src/types';
import { Tool, ToolDocument } from 'src/tools/tools.schema';
import { Tool as ToolInfo } from 'src/types';

@Injectable()
export class ApplicantsService {
  constructor(
    @InjectModel(ApplicationRequest.name)
    private readonly requestsModel: Model<ApplicationRequestDocument>,
    @InjectModel(Tool.name) private readonly toolModel: Model<ToolDocument>,
  ) {}

  async getRequestById(id: string) {
    try {
      const request = await this.requestsModel.findById(id);
      if (!request) throw Error('Request not found');
      return request;
    } catch (error) {
      throw new NotFoundException((error as Error).message);
    }
  }

  async postRequest(user: UserDocument) {
    const exists = await this.requestsModel.findOne({
      user_id: user._id,
      status: {
        $in: [ApplicantRequestStatus.ACCEPTED, ApplicantRequestStatus.PENDING],
      },
    });
    if (exists) {
      throw new ConflictException('Request already exists');
    }

    const request = await this.requestsModel.create({
      user_id: user._id,
    });

    return request.status;
  }

  async getRequests(status?: ApplicantRequestStatus) {
    const filter = status ? { status } : {};
    const request = await this.requestsModel.find(filter);
    return request;
  }

  async updateRequest(id: string, status: ApplicantRequestStatus) {
    const request = await this.getRequestById(id);
    if (!Object.values(ApplicantRequestStatus).includes(status))
      throw new BadRequestException('Invalid status');

    request.status = status;
    await request.save();

    return request;
  }

  async getUserRequestStatus(user: UserDocument) {
    const request = await this.requestsModel.findOne({
      user_id: user._id,
      status: { $nin: [ApplicantRequestStatus.REFUSED] },
    });

    return request ? request.status : null;
  }

  async getApplicantTools(user: UserDocument): Promise<ToolInfo[]> {
    const tools = await this.toolModel
      .find({ owner_id: user.id })
      .populate('owner_id')
      .populate('categories');

    return tools.map((tool) => tool.getInfo());
  }
}

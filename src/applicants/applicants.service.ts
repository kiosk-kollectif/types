import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import {
  ApplicantRequest,
  ApplicantRequestDocument,
} from './applicants.schema';
import { Model } from 'mongoose';
import { UserDocument } from 'src/users/users.schema';
import { ApplicantRequestStatus, Tool as ToolInfo } from 'src/types';
import { ToolsService } from 'src/tools/tools.service';
import { ReservationsService } from 'src/reservations/reservations.service';

@Injectable()
export class ApplicantsService {
  constructor(
    @InjectModel(ApplicantRequest.name)
    private readonly requestsModel: Model<ApplicantRequestDocument>,
    private readonly toolsService: ToolsService,
    private readonly reservationsService: ReservationsService,
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
    return await this.toolsService.getToolsByOwner(user);
  }

  async getApplicantRentalsInfo(user: UserDocument) {
    return await this.reservationsService.getReservationsForOwner(user);
  }
}

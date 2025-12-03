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
import { getUserPublicProfil, UserDocument } from 'src/users/users.schema';
import { ApplicantRequestStatus, UserPublicInfo } from 'src/types';
import { getToolInfo, Tool, type ToolModel } from 'src/tools/tools.schema';
import { Tool as ToolInfo } from 'src/types';
import {
  Reservation,
  ReservationDocument,
} from 'src/reservations/resevations.schema';
import { ReservationRequestStatus } from 'src/types/reservations';

@Injectable()
export class ApplicantsService {
  constructor(
    @InjectModel(ApplicationRequest.name)
    private readonly requestsModel: Model<ApplicationRequestDocument>,
    @InjectModel(Tool.name) private readonly toolModel: ToolModel,
    @InjectModel(Reservation.name)
    private readonly reservationsModel: Model<ReservationDocument>,
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
      .find({ owner_id: user._id })
      .populate('owner_id')
      .populate('categories');

    return tools.map((tool) => tool.getInfo());
  }

  async getApplicantRentalsInfo(user: UserDocument) {
    const rentals = await this.reservationsModel.aggregate([
      {
        $lookup: {
          from: 'tools',
          localField: 'tool_id',
          foreignField: '_id',
          as: 'tool',
        },
      },
      { $unwind: { path: '$tool', preserveNullAndEmptyArrays: true } },
      {
        $match: { 'tool.owner_id': user._id },
      },
      {
        $lookup: {
          from: 'users',
          localField: 'renter_id',
          foreignField: '_id',
          as: 'renter',
        },
      },
      { $unwind: { path: '$renter', preserveNullAndEmptyArrays: true } },
    ]);

    const result: {
      total: number;
      rentals: {
        status: ReservationRequestStatus;
        start_date: string;
        end_date: string;
        tool: ToolInfo;
        renter: UserPublicInfo;
      }[];
    } = { total: 0, rentals: [] };

    result.total = rentals.length;
    result.rentals = rentals.map((rental) => {
      return {
        tool: getToolInfo.call(rental.tool),
        renter: getUserPublicProfil.call(rental.renter),
        status: rental.status,
        start_date: rental.start_date.toISOString(),
        end_date: rental.end_date.toISOString(),
      };
    });

    return result;
  }
}

import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import {
  ApplicantRequest,
  ApplicantRequestDocument,
} from 'src/applicants/applicants.schema';
import { parseRenewQueue } from 'src/common/utils/parseRenewQueue';
import { ReservationsService } from 'src/reservations/reservations.service';
import { Tool, ToolDocument, type ToolModel } from 'src/tools/tools.schema';
import { ApplicantRequestStatus, ToolRequestStatus } from 'src/types';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class AdminsService {
  constructor(
    private readonly userservice: UsersService,
    private readonly reservationsService: ReservationsService,
    @InjectModel(Tool.name) private readonly toolModel: ToolModel,
    @InjectModel(ApplicantRequest.name)
    private appliquantRequestModel: Model<ApplicantRequestDocument>,
  ) {}
  async getReviewQueue(page: number, limit: number) {
    const [tools, applicants] = await Promise.all([
      this.toolModel
        .find({ status: ToolRequestStatus.PENDING })
        .populate('owner_id')
        .populate('categories')
        .populate('location'),
      this.appliquantRequestModel
        .find({
          status: ApplicantRequestStatus.PENDING,
        })
        .populate('user_id'),
    ]);

    const pendingRequest = [...tools, ...applicants].sort(
      (i, j) => j.createdAt.getTime() - i.createdAt.getTime(),
    ) as (ToolDocument | ApplicantRequestDocument)[];

    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const pageItems = pendingRequest.slice(startIndex, endIndex);

    return {
      totalItems: pendingRequest.length,
      totalPages: Math.ceil(pendingRequest.length / limit),
      currentPage: page,
      limit,
      requests: parseRenewQueue(pageItems),
    };
  }

  async getUsersStats(id: string) {
    // Recuperer les infos utilisateur
    const user = await this.userservice.getUserById(id);
    // Recuperer les outils de l'utilisateur
    const userTool = await this.toolModel.find({
      owner_id: new Types.ObjectId(id),
    });
    // recuprer les reservations de l'utilisateur
    const userReservations =
      await this.reservationsService.revervationsForUser(id);

    const userStats = {
      user: user.getUserProfil(),
      tools: {
        length: userTool.length,
        // Prendre 3 outils max
        name: userTool.map((t) => t.name).slice(0, 3),
      },
      reservations: userReservations.length,
    };

    return userStats;
  }
}

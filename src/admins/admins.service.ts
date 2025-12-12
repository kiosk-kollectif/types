import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  ApplicantRequest,
  ApplicantRequestDocument,
} from 'src/applicants/applicants.schema';
import { parseRenewQueue } from 'src/common/utils/parseRenewQueue';
import { Tool, ToolDocument, type ToolModel } from 'src/tools/tools.schema';
import { ApplicantRequestStatus, ToolRequestStatus } from 'src/types';

@Injectable()
export class AdminsService {
  constructor(
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
}

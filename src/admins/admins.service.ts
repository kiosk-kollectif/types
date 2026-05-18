import { Injectable, NotFoundException } from '@nestjs/common';
import { parseRenewQueue } from 'src/common/utils/parseRenewQueue';
import { ReservationsService } from 'src/reservations/reservations.service';
import { ToolsService } from 'src/tools/tools.service';
import { ApplicantsService } from 'src/applicants/applicants.service';
import { ApplicantRequestStatus } from 'src/types';
import { UsersService } from 'src/users/users.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { ToolDocument } from 'src/tools/tools.schema';
import { ApplicantRequestDocument } from 'src/applicants/applicants.schema';
import { mapUserToInfo } from 'src/users/users.mapper';
import { mapToolToInfo, PopulatedTool } from 'src/tools/tools.mapper';

@Injectable()
export class AdminsService {
  constructor(
    private readonly userservice: UsersService,
    private readonly reservationsService: ReservationsService,
    private readonly toolsService: ToolsService,
    private readonly applicantsService: ApplicantsService,
  ) {}

  async getReviewQueue(page: number, limit: number) {
    const [tools, applicants] = await Promise.all([
      this.toolsService.getPendingTools(),
      this.applicantsService.getRequests(ApplicantRequestStatus.PENDING),
    ]);

    const pendingRequest: (ToolDocument | ApplicantRequestDocument)[] = [
      ...tools,
      ...applicants,
    ].sort((i, j) => j.createdAt.getTime() - i.createdAt.getTime());

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
    const user = await this.userservice.getUserById(id);
    const userTool = await this.toolsService.getToolsByOwner(user);
    const userReservations =
      await this.reservationsService.getReservationsForUser(user);

    return {
      user: mapUserToInfo(user),
      tools: {
        length: userTool.length,
        name: userTool.map((t) => t.name).slice(0, 3),
      },
      reservations: Array.isArray(userReservations)
        ? userReservations.length
        : 0,
    };
  }

  async updateUser(id: string, updateDto: UpdateUserDto) {
    const user = await this.userservice.getUserById(id);
    await this.userservice.editUserInfo(user, updateDto);
    if (updateDto.profile)
      await this.userservice.editUserProfile(user, updateDto.profile);
    if (updateDto.active !== undefined) {
      user.active = updateDto.active;
      await user.save();
    }

    return mapUserToInfo(user);
  }

  async getToolsStats(id: string) {
    const tool = await this.toolsService.getToolById(id);
    if (!tool) throw new NotFoundException('Tool not found');
    const toolsReservations =
      await this.reservationsService.getReservationsForItem(id);

    return {
      tool: mapToolToInfo(tool as unknown as PopulatedTool),
      reservations: Array.isArray(toolsReservations)
        ? toolsReservations.length
        : 0,
    };
  }
}

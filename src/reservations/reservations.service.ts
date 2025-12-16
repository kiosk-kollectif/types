import {
  BadRequestException,
  ConflictException,
  Injectable,
} from '@nestjs/common';
import { UserDocument } from 'src/users/users.schema';
import { PostReservationDto } from './dto/post-reservation.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Reservation, ReservationDocument } from './resevations.schema';
import { ReservationRequestStatus, ToolPublicInfo, UserStats } from 'src/types';
import { getToolsPublicInfo } from 'src/tools/tools.schema';

@Injectable()
export class ReservationsService {
  constructor(
    @InjectModel(Reservation.name)
    private readonly reservationsModel: Model<ReservationDocument>,
  ) {}

  async getReservationsForItem(
    itemsId: string | Types.ObjectId | (string | Types.ObjectId)[],
  ) {
    if (Array.isArray(itemsId)) {
      return await this.reservationsModel.find({
        tool_id: {
          $in: itemsId.map((v) =>
            typeof v == 'string' ? new Types.ObjectId(v) : v,
          ),
        },
      });
    } else {
      return await this.reservationsModel.find({
        tool_id:
          typeof itemsId == 'string' ? new Types.ObjectId(itemsId) : itemsId,
      });
    }
  }

  private async _checkConflictOnReservations(
    tool_id: string | Types.ObjectId,
    start_date: Date,
    endDate: Date,
  ) {
    return await this.reservationsModel.exists({
      tool_id:
        typeof tool_id == 'string' ? new Types.ObjectId(tool_id) : tool_id,
      start_date: { $lte: endDate },
      end_date: { $gte: start_date },
    });
  }

  async postReservations(user: UserDocument, reservations: PostReservationDto) {
    //verifier si les outils ne sont pas vides;
    if (
      reservations.tools.length == 0 ||
      reservations.tools.some((v) => !v.startDate || !v.endDate || !v.toolId)
    )
      throw new BadRequestException('Missing data');

    //Verifier si les reservations ne rentres pas en conflits
    for (const tool of reservations.tools) {
      const conflict = await this._checkConflictOnReservations(
        tool.toolId,
        new Date(tool.startDate),
        new Date(tool.endDate),
      );

      if (conflict) {
        throw new ConflictException(
          `Conflict on reservation for tool ${tool.toolId}`,
          { cause: tool.toolId },
        );
      }
    }

    return await this.reservationsModel.insertMany(
      reservations.tools.map((tool) => {
        return {
          tool_id: new Types.ObjectId(tool.toolId),
          renter_id: new Types.ObjectId(user._id),
          start_date: new Date(tool.startDate),
          end_date: new Date(tool.endDate),
        };
      }),
    );
  }

  async getReservationsForUser(user: UserDocument): Promise<UserStats> {
    const result = await this.reservationsModel
      .find({ renter_id: user._id })
      .populate('tool_id');

    const tools_rented = result.map((v) => {
      return {
        tool: getToolsPublicInfo.call(v.tool_id) as ToolPublicInfo,
        status: v.status,
      };
    });

    const rentals_tools = tools_rented.filter(
      (v) => v.status == ReservationRequestStatus.PENDING,
    );

    return {
      rentalsTools: {
        length: rentals_tools.length,
        tools: rentals_tools.map((v) => v.tool),
      },
      total_rentedd_tools: {
        length: tools_rented.length,
        tools: tools_rented.map((v) => v.tool),
      },
    };
  }

  async revervationsForUser(user_id: string) {
    return await this.reservationsModel.find({
      renter_id: new Types.ObjectId(user_id),
    });
  }
}

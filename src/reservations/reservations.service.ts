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
import {
  ReservationRequestStatus,
  UserStats,
  type Reservation as ReservationType,
} from 'src/types';
import { mapToolToPublicInfo, PopulatedTool } from 'src/tools/tools.mapper';
import {
  mapReservationToType,
  PopulatedReservation,
} from './reservations.mapper';

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
          status: ReservationRequestStatus.PENDING,
          history: [
            {
              status: ReservationRequestStatus.PENDING,
              changedAt: new Date(),
              note: 'Réservation créée',
            },
          ],
        };
      }),
    );
  }

  async getReservationsForUser(user: UserDocument): Promise<UserStats> {
    const result = await this.reservationsModel
      .find({ renter_id: user._id })
      .populate<{ tool_id: PopulatedTool }>('tool_id');

    const tools_rented = result.map((v) => {
      return {
        tool: mapToolToPublicInfo(v.tool_id),
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

  async getReservationsForOwner(user: UserDocument) {
    const rentals =
      await this.reservationsModel.aggregate<PopulatedReservation>([
        {
          $lookup: {
            from: 'tools',
            localField: 'tool_id',
            foreignField: '_id',
            as: 'tool_id',
          },
        },
        { $unwind: { path: '$tool_id', preserveNullAndEmptyArrays: true } },
        {
          $match: { 'tool_id.owner_id': user._id },
        },
        {
          $lookup: {
            from: 'users',
            localField: 'renter_id',
            foreignField: '_id',
            as: 'renter_id',
          },
        },
        { $unwind: { path: '$renter_id', preserveNullAndEmptyArrays: true } },
      ]);

    const result: {
      total: number;
      rentals: ReservationType[];
    } = { total: rentals.length, rentals: [] };

    result.rentals = rentals.map((rental) => mapReservationToType(rental));

    return result;
  }

  async findAll(query: {
    page?: number;
    limit?: number;
    search?: string;
    status?: ReservationRequestStatus;
  }): Promise<{
    totalItems: number;
    totalPages: number;
    currentPage: number;
    limit: number;
    reservations: ReservationType[];
  }> {
    const { page = 1, limit = 10, search, status } = query;

    // Construction de l'agrégation avec renommage pour correspondre à PopulatedReservation
    const aggregate = this.reservationsModel.aggregate([
      {
        $lookup: {
          from: 'tools',
          localField: 'tool_id',
          foreignField: '_id',
          as: 'tool_id',
        },
      },
      { $unwind: '$tool_id' },
      {
        $lookup: {
          from: 'users',
          localField: 'renter_id',
          foreignField: '_id',
          as: 'renter_id',
        },
      },
      { $unwind: '$renter_id' },
    ]);

    if (search) {
      aggregate.match({
        $or: [
          { 'tool_id.name': { $regex: search, $options: 'i' } },
          { 'renter_id.username': { $regex: search, $options: 'i' } },
          { 'renter_id.email': { $regex: search, $options: 'i' } },
        ],
      });
    }

    if (status) {
      aggregate.match({ status });
    }

    const totalItems = (await aggregate.exec()).length;
    const totalPages = Math.ceil(totalItems / limit);

    const results = (await aggregate
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .exec()) as PopulatedReservation[];

    const reservations = results.map((res) => mapReservationToType(res));

    return {
      totalItems,
      totalPages,
      currentPage: page,
      limit,
      reservations,
    };
  }

  async updateStatus(
    id: string,
    status: ReservationRequestStatus,
    note?: string,
  ) {
    const reservation = await this.reservationsModel.findById(id);
    if (!reservation) throw new BadRequestException('Reservation not found');

    reservation.status = status;
    reservation.history.push({
      status,
      changedAt: new Date(),
      note,
    });
    return await reservation.save();
  }
}

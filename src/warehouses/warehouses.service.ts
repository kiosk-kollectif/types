import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { WhareHouseDocument, WhareHouse } from './warehouses.schema';
import { AddWarehouseDto } from './dto/add-warehouse.dto';
import { Model, Types } from 'mongoose';

@Injectable()
export class WarehousesService {
  constructor(
    @InjectModel(WhareHouse.name)
    private readonly whareHouseModel: Model<WhareHouseDocument>,
  ) {}

  async addWareHouse(house: AddWarehouseDto) {
    if (!house.name) {
      throw new BadRequestException('Provide a name for the warehouse');
    }
    const newHouse = await this.whareHouseModel.create({
      name: house.name,
      location: house.location,
      capacity: house.capacity,
      manager_id: house?.managerId ?? null,
    });

    return newHouse;
  }

  async getWareHouseById(id: string) {
    const house = await this.whareHouseModel.findById(id);
    if (!house) {
      throw new NotFoundException('Warehouse not found');
    }

    return house;
  }

  async editWareHouse(id: string, house: Partial<AddWarehouseDto>) {
    const updatedHouse = await this.getWareHouseById(id);

    updatedHouse.name = house.name ?? updatedHouse.name;
    updatedHouse.location = house.location ?? updatedHouse.location;
    updatedHouse.capacity = house.capacity ?? updatedHouse.capacity;
    updatedHouse.manager_id = house.managerId
      ? new Types.ObjectId(house.managerId)
      : updatedHouse.manager_id;

    await updatedHouse.save();

    return updatedHouse;
  }
}

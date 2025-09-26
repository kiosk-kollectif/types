import { Module } from '@nestjs/common';
import { WarehousesService } from './warehouses.service';
import { MongooseModule } from '@nestjs/mongoose';
import { WhareHouse, WhareHouseSchema } from './warehouses.schema';
import { WarehousesController } from './warehouses.controller';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: WhareHouse.name,
        schema: WhareHouseSchema,
      },
    ]),
    AuthModule,
  ],
  providers: [WarehousesService],
  controllers: [WarehousesController],
})
export class WarehousesModule {}

import { Module } from '@nestjs/common';
import { WarehousesService } from './warehouses.service';
import { MongooseModule } from '@nestjs/mongoose';
import { WhareHouse, WhareHouseSchema } from './warehouses.schema';
import { WarehousesController } from './warehouses.controller';
import { AuthModule } from 'src/auth/auth.module';
import { InvalidesTokenModule } from 'src/invalides-token/invalides-token.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: WhareHouse.name,
        schema: WhareHouseSchema,
      },
    ]),
    AuthModule,
    InvalidesTokenModule,
  ],
  providers: [WarehousesService],
  controllers: [WarehousesController],
})
export class WarehousesModule {}

import { Module } from '@nestjs/common';
import { ToolsController } from './tools.controller';
import { ToolsService } from './tools.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Tool, ToolDocumentSchema } from './tools.schema';
import { UsersModule } from 'src/users/users.module';
import { ToolsCategoriesModule } from 'src/tools-categories/tools-categories.module';
import { AuthModule } from 'src/auth/auth.module';
import { InvalidesTokenModule } from 'src/invalides-token/invalides-token.module';
import { ReservationsModule } from 'src/reservations/reservations.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Tool.name, schema: ToolDocumentSchema },
    ]),
    UsersModule,
    ToolsCategoriesModule,
    AuthModule,
    InvalidesTokenModule,
    ReservationsModule,
  ],
  controllers: [ToolsController],
  providers: [ToolsService],
})
export class ToolsModule {}

import { Module } from '@nestjs/common';
import { AdminsController } from './admins.controller';
import { AdminsService } from './admins.service';
import { MongooseModule } from '@nestjs/mongoose';
import {
  ApplicantRequest,
  ApplicantRequestSchema,
} from 'src/applicants/applicants.schema';
import { Tool, ToolDocumentSchema } from 'src/tools/tools.schema';
import { AuthModule } from 'src/auth/auth.module';
import { InvalidesTokenModule } from 'src/invalides-token/invalides-token.module';
import { UsersModule } from 'src/users/users.module';
import { ReservationsModule } from 'src/reservations/reservations.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: ApplicantRequest.name, schema: ApplicantRequestSchema },
      { name: Tool.name, schema: ToolDocumentSchema },
    ]),
    AuthModule,
    InvalidesTokenModule,
    UsersModule,
    ReservationsModule,
  ],
  controllers: [AdminsController],
  providers: [AdminsService],
})
export class AdminsModule {}

import { Module } from '@nestjs/common';
import { AdminsController } from './admins.controller';
import { AdminsService } from './admins.service';
import { MongooseModule } from '@nestjs/mongoose';
import {
  ApplicantRequest,
  ApplicantRequestSchema,
} from 'src/applicants/applicants.schema';
import { AuthModule } from 'src/auth/auth.module';
import { InvalidesTokenModule } from 'src/invalides-token/invalides-token.module';
import { UsersModule } from 'src/users/users.module';
import { ReservationsModule } from 'src/reservations/reservations.module';
import { ToolsModule } from 'src/tools/tools.module';
import { ApplicantsModule } from 'src/applicants/applicants.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: ApplicantRequest.name, schema: ApplicantRequestSchema },
    ]),
    AuthModule,
    InvalidesTokenModule,
    UsersModule,
    ReservationsModule,
    ToolsModule,
    ApplicantsModule,
  ],
  controllers: [AdminsController],
  providers: [AdminsService],
})
export class AdminsModule {}

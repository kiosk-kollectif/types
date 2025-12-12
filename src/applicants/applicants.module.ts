import { Module } from '@nestjs/common';
import { ApplicantsController } from './applicants.controller';
import { ApplicantsService } from './applicants.service';
import { MongooseModule } from '@nestjs/mongoose';
import {
  ApplicantRequest,
  ApplicantRequestSchema,
} from './applicants.schema';
import { AuthModule } from 'src/auth/auth.module';
import { InvalidesTokenModule } from 'src/invalides-token/invalides-token.module';
import { Tool, ToolDocumentSchema } from 'src/tools/tools.schema';
import {
  Reservation,
  ReservationDocumentSchema,
} from 'src/reservations/resevations.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: ApplicantRequest.name, schema: ApplicantRequestSchema },
      { name: Tool.name, schema: ToolDocumentSchema },
      { name: Reservation.name, schema: ReservationDocumentSchema },
    ]),
    AuthModule,
    InvalidesTokenModule,
  ],
  controllers: [ApplicantsController],
  providers: [ApplicantsService],
})
export class ApplicantsModule {}

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
import { ToolsModule } from 'src/tools/tools.module';
import { ReservationsModule } from 'src/reservations/reservations.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: ApplicantRequest.name, schema: ApplicantRequestSchema },
    ]),
    AuthModule,
    InvalidesTokenModule,
    ToolsModule,
    ReservationsModule,
  ],
  controllers: [ApplicantsController],
  providers: [ApplicantsService],
  exports: [ApplicantsService],
})
export class ApplicantsModule {}

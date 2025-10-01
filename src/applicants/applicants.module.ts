import { Module } from '@nestjs/common';
import { ApplicantsController } from './applicants.controller';
import { ApplicantsService } from './applicants.service';
import { MongooseModule } from '@nestjs/mongoose';
import {
  ApplicationRequest,
  ApplicationRequestSchema,
} from './applicants.schema';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: ApplicationRequest.name, schema: ApplicationRequestSchema },
    ]),
    AuthModule,
  ],
  controllers: [ApplicantsController],
  providers: [ApplicantsService],
})
export class ApplicantsModule {}

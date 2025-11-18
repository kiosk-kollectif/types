import { Module } from '@nestjs/common';
import { ApplicantsController } from './applicants.controller';
import { ApplicantsService } from './applicants.service';
import { MongooseModule } from '@nestjs/mongoose';
import {
  ApplicationRequest,
  ApplicationRequestSchema,
} from './applicants.schema';
import { AuthModule } from 'src/auth/auth.module';
import { InvalidesTokenModule } from 'src/invalides-token/invalides-token.module';
import { Tool, ToolDocumentSchema } from 'src/tools/tools.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: ApplicationRequest.name, schema: ApplicationRequestSchema },
      { name: Tool.name, schema: ToolDocumentSchema },
    ]),
    AuthModule,
    InvalidesTokenModule,
  ],
  controllers: [ApplicantsController],
  providers: [ApplicantsService],
})
export class ApplicantsModule {}

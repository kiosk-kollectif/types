import { Module } from '@nestjs/common';
import { VerificationCodesController } from './verification-codes.controller';
import { VerificationCodesService } from './verification-codes.service';
import { UsersModule } from 'src/users/users.module';
import { MongooseModule } from '@nestjs/mongoose';
import {
  VerificationCode,
  VerificationCodesSchema,
} from './verification-codes.schema';

@Module({
  imports: [
    UsersModule,
    MongooseModule.forFeature([
      { name: VerificationCode.name, schema: VerificationCodesSchema },
    ]),
  ],
  controllers: [VerificationCodesController],
  providers: [VerificationCodesService],
})
export class VerificationCodesModule {}

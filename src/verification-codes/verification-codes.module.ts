import { Module } from '@nestjs/common';
import { VerificationCodesController } from './verification-codes.controller';
import { VerificationCodesService } from './verification-codes.service';
import { MongooseModule } from '@nestjs/mongoose';
import {
  VerificationCode,
  VerificationCodesSchema,
} from './verification-codes.schema';
import { AuthModule } from 'src/auth/auth.module';
import { InvalidesTokenModule } from 'src/invalides-token/invalides-token.module';
import { MailerModule } from 'src/mailer/mailer.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: VerificationCode.name, schema: VerificationCodesSchema },
    ]),
    AuthModule,
    InvalidesTokenModule,
    MailerModule,
  ],
  controllers: [VerificationCodesController],
  providers: [VerificationCodesService],
})
export class VerificationCodesModule {}

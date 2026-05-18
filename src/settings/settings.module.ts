import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { SettingsService } from './settings.service';
import { SettingsController } from './settings.controller';
import { Settings, SettingsSchema } from './settings.schema';
import { AuthModule } from 'src/auth/auth.module';
import { InvalidesTokenModule } from 'src/invalides-token/invalides-token.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Settings.name, schema: SettingsSchema }]),
    AuthModule,
    InvalidesTokenModule,
  ],
  controllers: [SettingsController],
  providers: [SettingsService],
})
export class SettingsModule {}

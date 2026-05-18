import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Settings, SettingsDocument } from './settings.schema';
import { UpdateSettingsDto } from './dto/update-settings.dto';

@Injectable()
export class SettingsService implements OnModuleInit {
  constructor(
    @InjectModel(Settings.name)
    private readonly settingsModel: Model<SettingsDocument>,
  ) {}

  async onModuleInit() {
    const settings = await this.settingsModel.findOne();
    if (!settings) {
      await this.settingsModel.create({});
    }
  }

  async getSettings() {
    return await this.settingsModel.findOne();
  }

  async updateSettings(updateSettingsDto: UpdateSettingsDto) {
    return await this.settingsModel.findOneAndUpdate({}, updateSettingsDto, {
      new: true,
      upsert: true,
    });
  }
}

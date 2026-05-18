import { Controller, Get, Body, Patch } from '@nestjs/common';
import { SettingsService } from './settings.service';
import { UpdateSettingsDto } from './dto/update-settings.dto';
import { PermissionLevel } from 'src/common/decorator/permission-level.decorator';
import { UserRole } from 'src/types';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { ResponseMessage } from 'src/common/decorator/response-message.decorator';

@ApiTags('Settings')
@Controller('settings')
export class SettingsController {
  constructor(private readonly settingsService: SettingsService) {}

  @Get()
  @PermissionLevel([UserRole.ADMIN])
  @ResponseMessage('Paramètres récupérés')
  @ApiOperation({
    summary: 'Récupérer les paramètres globaux (Admin uniquement)',
  })
  getSettings() {
    return this.settingsService.getSettings();
  }

  @Patch()
  @PermissionLevel([UserRole.ADMIN])
  @ResponseMessage('Paramètres mis à jour')
  @ApiOperation({ summary: 'Mettre à jour les paramètres (Admin uniquement)' })
  updateSettings(@Body() updateSettingsDto: UpdateSettingsDto) {
    return this.settingsService.updateSettings(updateSettingsDto);
  }
}

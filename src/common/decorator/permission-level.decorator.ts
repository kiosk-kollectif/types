import { SetMetadata, UseGuards, applyDecorators } from '@nestjs/common';
import { ApiForbiddenResponse, ApiHeader } from '@nestjs/swagger';
import { PermissionLevelGuard } from 'src/auth/permission-level.guard';

export const PERMISSION_LEVEL_KEY = 'permissionLevel';

export const PermissionLevel = (levels: string[]) => {
  return applyDecorators(
    SetMetadata(PERMISSION_LEVEL_KEY, levels),
    UseGuards(PermissionLevelGuard),
    ApiHeader({
      name: 'Authorization',
      description:
        'Token JWT des personnes autorisées (' + levels.join(' ,') + ')',
    }),
    ApiForbiddenResponse({
      description: 'Non autorisé',
    }),
  );
};

import { IsNumber, IsOptional } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateSettingsDto {
  @ApiPropertyOptional()
  @IsNumber()
  @IsOptional()
  commissionRate?: number;
}

import { IsArray, IsOptional, IsString } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { CreateCategoryDto } from './create-category.dto';

export class GlobalEditCategoryDto {
  @ApiPropertyOptional()
  @IsArray()
  @IsOptional()
  add?: CreateCategoryDto[];

  @ApiPropertyOptional()
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  remove?: string[];

  @ApiPropertyOptional()
  @IsArray()
  @IsOptional()
  edit?: { id: string; name?: string; description?: string }[];
}

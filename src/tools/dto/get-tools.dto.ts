import { Transform } from 'class-transformer';
import {
  IsBoolean,
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import { ToolRequestStatus } from 'src/types';

export class GetToolQueryDto {
  @IsString()
  @IsOptional()
  search?: string;

  @IsString()
  @IsOptional()
  category?: string;

  @IsNumber()
  @IsOptional()
  @Transform(({ value }: { value: string }) => parseInt(value))
  page?: number;

  @IsNumber()
  @IsOptional()
  @Transform(({ value }: { value: string }) => parseInt(value))
  limit?: number;

  @IsBoolean()
  @IsOptional()
  @Transform(({ value }: { value: string }) => value === 'true')
  availableOnly?: boolean;

  @IsEnum(ToolRequestStatus)
  @IsOptional()
  @Transform(({ value }: { value: string }) => value.toLowerCase())
  status?: ToolRequestStatus;
}

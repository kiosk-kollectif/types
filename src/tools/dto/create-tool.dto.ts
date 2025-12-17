/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import {
  IsArray,
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import { ToolRequestStatus } from 'src/types';

export class CreateToolDto {
  @ApiProperty()
  @IsString()
  name: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  owner_id?: string;

  @IsArray()
  @IsString({ each: true })
  @Transform((value) => (Array.isArray(value) ? value : [value]))
  @ApiProperty()
  categories: string[];

  @IsString()
  @IsOptional()
  @ApiProperty({ required: false })
  description?: string;

  @IsNumber()
  @IsOptional()
  @Transform(({ value }) => Number(value))
  @ApiProperty({ required: false })
  price?: number;

  @IsNumber()
  @IsOptional()
  @Transform(({ value }) => Number(value))
  @ApiProperty({ required: false })
  dayprice?: number;

  @IsString()
  @IsOptional()
  @ApiProperty({ required: false })
  location?: string;

  @IsEnum(ToolRequestStatus)
  @Transform(({ value }) => value?.toLowerCase())
  @ApiProperty({ required: false })
  status: ToolRequestStatus;
}

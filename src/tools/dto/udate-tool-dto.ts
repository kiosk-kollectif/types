import { ApiProperty, PartialType } from '@nestjs/swagger';
import { CreateToolDto } from './create-tool.dto';
import { IsArray, IsOptional, IsString } from 'class-validator';

export class UpdateToolDto extends PartialType(CreateToolDto) {
  @ApiProperty({
    required: false,
    type: [String],
    description: "liste des urls d'images non modifiers",
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  images?: string[];
}

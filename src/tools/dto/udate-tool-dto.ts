import { ApiProperty, PartialType } from '@nestjs/swagger';
import { CreateToolDto } from './create-tool.dto';

export class UpdateToolDto extends PartialType(CreateToolDto) {
  @ApiProperty({
    required: false,
    type: [String],
    description: "liste des urls d'images non modifiers",
  })
  images?: string[];
}

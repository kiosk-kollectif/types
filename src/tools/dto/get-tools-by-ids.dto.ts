import { ApiProperty } from '@nestjs/swagger';

export class GetToolByIds {
  @ApiProperty({ required: true })
  ids: string[];
}

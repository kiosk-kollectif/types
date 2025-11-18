import { ApiProperty } from '@nestjs/swagger';

export class CreateToolDto {
  @ApiProperty()
  name: string;

  @ApiProperty({ required: false })
  owner_id?: string;

  @ApiProperty()
  categories: string[];

  @ApiProperty({ required: false })
  description?: string;

  @ApiProperty({ required: false })
  price?: number;

  @ApiProperty({ required: false })
  dayprice?: number;

  @ApiProperty({ required: false })
  location: string;

  @ApiProperty({ required: false })
  status: string;
}

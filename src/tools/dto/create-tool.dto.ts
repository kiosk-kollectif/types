import { ApiProperty } from '@nestjs/swagger';

export class CreateToolDto {
  @ApiProperty()
  name: string;

  @ApiProperty({ required: false })
  owner_id?: string;

  @ApiProperty()
  category: string;

  @ApiProperty({ required: false })
  description?: string;

  @ApiProperty()
  condition: string;

  @ApiProperty({ required: false })
  price?: number;

  @ApiProperty({ required: false })
  location: string;

  @ApiProperty({ required: false })
  status: string;
}

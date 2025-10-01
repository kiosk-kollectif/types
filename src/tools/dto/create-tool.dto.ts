import { ApiProperty } from '@nestjs/swagger';

export class CreateToolDto {
  @ApiProperty()
  name: string;

  @ApiProperty()
  owner_id: string;

  @ApiProperty()
  category: string;

  @ApiProperty({ required: false })
  description?: string;

  @ApiProperty()
  condition: string;

  @ApiProperty()
  price: number;

  @ApiProperty()
  location: string;
}

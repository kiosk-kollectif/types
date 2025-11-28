import { ApiProperty } from '@nestjs/swagger';

class ToolsRentalDetail {
  @ApiProperty({ required: true })
  toolId: string;

  @ApiProperty({
    required: true,
    type: String,
    example: '2025-12-01T10:00:00.000Z',
  })
  startDate: string;

  @ApiProperty({
    required: true,
    type: String,
    example: '2025-12-01T10:00:00.000Z',
  })
  endDate: string;
}

export class PostReservationDto {
  @ApiProperty({
    required: true,
    type: [ToolsRentalDetail],
  })
  tools: ToolsRentalDetail[];
}

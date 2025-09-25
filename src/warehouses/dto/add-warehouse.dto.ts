import { ApiProperty } from '@nestjs/swagger';

export class AddWarehouseDto {
  @ApiProperty({ description: "nom de l'entropots", required: true })
  name: string;

  @ApiProperty({ description: "adresse de l'entropots", required: true })
  location: string;

  @ApiProperty({ description: "capacité de l'entropots", required: true })
  capacity: number;

  @ApiProperty({ description: 'id du manager', required: false })
  managerId?: string;
}

import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateCategoryDto {
  @ApiProperty({ example: 'Electronique', description: 'Nom de la categorie' })
  name!: string;

  @ApiPropertyOptional({
    example: 'Categorie des appareils electroniques',
    description: 'Description de la categorie',
  })
  description?: string;
}

import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class EditUserProfilDto {
  @IsOptional()
  @ApiProperty({
    required: false,
    example: 'John',
    description: "Nom de l'utilisateur",
  })
  readonly lastname?: string;

  @IsOptional()
  @IsString()
  @ApiProperty({
    required: false,
    example: 'Doe',
    description: "Prenom de l'utilisateur",
  })
  readonly firstname?: string;

  @IsOptional()
  @IsString()
  @ApiProperty({
    required: false,
    example: 'Lome- kegue',
    description: "Addresse de l'utilisateur",
  })
  readonly adress?: string;

  @IsOptional()
  @IsString()
  @ApiProperty({
    required: false,
    example: '0909090909',
    description: 'Numero de telephone',
  })
  readonly phone?: string;

  @IsOptional()
  @IsString()
  @ApiProperty({
    required: false,
    description: 'designe si une photo de profil doit etre retiree',
    enum: ['removed'],
  })
  readonly picture?: string;
}

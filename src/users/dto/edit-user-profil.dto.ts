import { ApiProperty } from '@nestjs/swagger';

export class EditUserProfilDto {
  @ApiProperty({
    required: false,
    example: 'John',
    description: "Nom de l'utilisateur",
  })
  readonly lastname?: string;

  @ApiProperty({
    required: false,
    example: 'Doe',
    description: "Prenom de l'utilisateur",
  })
  readonly firstname?: string;

  @ApiProperty({
    required: false,
    example: 'Lome- kegue',
    description: "Addresse de l'utilisateur",
  })
  readonly adress?: string;

  @ApiProperty({
    required: false,
    example: '0909090909',
    description: 'Numero de telephone',
  })
  readonly phone?: string;

  @ApiProperty({
    required: false,
    description: "designe si une photo de profil doit etre retiree",
    enum: ["removed"]
  })
  readonly picture?: string
}

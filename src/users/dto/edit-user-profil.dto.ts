import { ApiProperty } from '@nestjs/swagger';

export class EditUserProfilDto {
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

  // @ApiProperty({
  //   required: false,
  //   example: 'https://google.com',
  //   description: 'Lien de la photo de profil',
  // })
  // readonly picture: string;
}

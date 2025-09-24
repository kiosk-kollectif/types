import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {
  @ApiProperty({ example: 'Jhon', description: "prenom de l'utilisateur" })
  readonly firstname: string;

  @ApiProperty({ example: 'Doe', description: "nom de l'utilisateur" })
  readonly lastname: string;

  @ApiProperty({
    example: 'jhondoe@gmail.com',
    description: "email de l'utilisateur",
  })
  readonly email: string;

  @ApiProperty({
    example: 'jhondoe',
    description: "nom d'utilisateur",
  })
  readonly password: string;

  // @ApiProperty({
  //   example: 'admin',
  //   description: "role de l'utilisateur",
  //   required: false,
  // })
  // readonly role?: string;
}

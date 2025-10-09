import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {
  @ApiProperty({ example: 'Jhon', description: "nom d'utilisateur" })
  readonly username: string;

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
}

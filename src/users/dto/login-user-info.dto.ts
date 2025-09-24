import { ApiProperty } from '@nestjs/swagger';

export class LoginUserInfoDto {
  @ApiProperty({
    example: 'johndoe@example.com',
    description: "Email de l'utilisateur",
  })
  readonly email: string;

  @ApiProperty({
    example: 'password123',
    description: "Mot de passe de l'utilisateur",
  })
  readonly password: string;
}

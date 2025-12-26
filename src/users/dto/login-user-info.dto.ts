import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class LoginUserInfoDto {
  @IsString()
  @ApiProperty({
    example: 'johndoe@example.com',
    description: "Email de l'utilisateur",
  })
  readonly email: string;

  @IsString()
  @ApiProperty({
    example: 'password123',
    description: "Mot de passe de l'utilisateur",
  })
  readonly password: string;
}

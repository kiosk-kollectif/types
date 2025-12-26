import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class CreateUserDto {
  @IsString()
  @ApiProperty({ example: 'Jhon', description: "nom d'utilisateur" })
  readonly username: string;

  @IsString()
  @ApiProperty({
    example: 'jhondoe@gmail.com',
    description: "email de l'utilisateur",
  })
  readonly email: string;

  @IsString()
  @ApiProperty({
    example: 'jhondoe',
    description: "nom d'utilisateur",
  })
  readonly password: string;
}

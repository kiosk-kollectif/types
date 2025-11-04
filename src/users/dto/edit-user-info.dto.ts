import { ApiProperty } from '@nestjs/swagger';
// import { Role } from 'src/common/enums/role.enum';

export class EditUserInfoDto {
  @ApiProperty({ required: false, description: "prenom de l'utilisateur" })
  readonly username?: string;

  @ApiProperty({ required: false, description: "email de l'utilisateur" })
  readonly email?: string;

  @ApiProperty({
    required: false,
    description: "mot de passe de l'utilisateur",
  })
  readonly password?: string;
}

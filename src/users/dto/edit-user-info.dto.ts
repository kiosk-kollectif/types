import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';
// import { Role } from 'src/common/enums/role.enum';

export class EditUserInfoDto {
  @IsOptional()
  @IsString()
  @ApiProperty({ required: false, description: "prenom de l'utilisateur" })
  readonly username?: string;

  @IsOptional()
  @IsString()
  @ApiProperty({ required: false, description: "email de l'utilisateur" })
  readonly email?: string;

  @IsOptional()
  @IsString()
  @ApiProperty({
    required: false,
    description: "mot de passe de l'utilisateur",
  })
  readonly password?: string;
}

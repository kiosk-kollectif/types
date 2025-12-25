import { Type } from 'class-transformer';
import { IsBoolean, IsOptional, ValidateNested } from 'class-validator';
import { EditUserInfoDto } from 'src/users/dto/edit-user-info.dto';
import { EditUserProfilDto } from 'src/users/dto/edit-user-profil.dto';

export class UpdateUserDto extends EditUserInfoDto {
  @IsOptional()
  @ValidateNested()
  @Type(() => EditUserProfilDto)
  profile?: EditUserProfilDto;

  @IsOptional()
  @IsBoolean()
  active?: boolean;
}

import { Transform } from 'class-transformer';
import { IsEnum, IsNumber, IsOptional, IsString } from 'class-validator';
import { UserRole } from 'src/types';

export class GetUsersQueryRequestDto {
  @IsNumber()
  @Transform(({ value }) => Number(value))
  page: number;

  @IsNumber()
  @Transform(({ value }) => Number(value))
  limit: number;

  @IsOptional()
  @IsString()
  status?: 'active' | 'inactive';

  @IsOptional()
  @IsEnum(UserRole)
  role?: UserRole;

  @IsOptional()
  @IsString()
  search?: string;
}

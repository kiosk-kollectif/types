import { IsEmail, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateManagerDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  username!: string;

  @ApiProperty()
  @IsEmail()
  email!: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  firstname?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  lastname?: string;
}

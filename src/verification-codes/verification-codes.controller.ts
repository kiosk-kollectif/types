import {
  BadRequestException,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import {
  ApiHeader,
  ApiOperation,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { VerificationCodesService } from './verification-codes.service';
import { OwnerRequestGuard } from 'src/auth/owner.guard';

@ApiTags('Codes et Verification')
@Controller('verification-codes')
export class VerificationCodesController {
  constructor(private readonly verifCodeServ: VerificationCodesService) {}

  @UseGuards(OwnerRequestGuard)
  @Post('send')
  @HttpCode(200)
  @ApiHeader({
    name: 'Authorization',
    description: "Token d'authentification",
  })
  @ApiOperation({ summary: 'Envoyer un code de vérification' })
  @ApiQuery({ name: 'id', required: true, description: "ID de l'utilisateur" })
  @ApiResponse({
    status: 200,
    description: 'Code de vérification envoyé avec succès',
    schema: {
      example: {
        statusCode: 200,
        message: 'Verification code sent successfully',
      },
    },
  })
  @ApiResponse({
    status: 404,
    description: "L'utilisateur n'existe pas",
  })
  @ApiResponse({
    status: 401,
    description: 'Veillez patienter avant de redemander un nouveau code',
  })
  async sendVerificationCode(@Query('id') id: string) {
    if (!id) {
      throw new BadRequestException('ID is required');
    }
    await this.verifCodeServ.createVerificationCode(id);

    return {
      StatusCode: HttpStatus.OK,
      message: 'Verification code sent successfully',
    };
  }

  @UseGuards(OwnerRequestGuard)
  @ApiHeader({ name: 'Authorization', description: "Token d'authentification" })
  @Post('verify')
  @HttpCode(200)
  @ApiOperation({ summary: 'Vérifier un code de vérification' })
  @ApiQuery({
    name: 'id',
    required: true,
    description: "ID de l'utilisateur",
    example: '68d46a5a0f81b0ed1467915d',
  })
  @ApiQuery({
    name: 'code',
    required: true,
    description: 'Code de vérification à vérifier',
  })
  @ApiResponse({
    status: 200,
    description: 'Code de vérification vérifié avec succès',
    schema: {
      example: {
        statusCode: 200,
        message: 'Verification code confirmed successfully',
      },
    },
  })
  @ApiResponse({
    status: 404,
    description: "L'utilisateur n'existe pas",
  })
  @ApiResponse({
    status: 400,
    description: 'Paramètres manquants ou code de vérification invalide',
  })
  async confirmVerificationCode(
    @Query('id') id: string,
    @Query('code') code: string,
  ) {
    if (!id || !code) {
      throw new BadRequestException('ID and code are required');
    }

    await this.verifCodeServ.confirmVerificationCode(id, parseInt(code));

    return {
      StatusCode: HttpStatus.OK,
      message: 'Verification code confirmed successfully',
    };
  }
}

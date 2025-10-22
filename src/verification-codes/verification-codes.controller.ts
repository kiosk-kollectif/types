import { Controller, HttpCode, HttpStatus, Post, Query } from '@nestjs/common';
import {
  ApiConflictResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { VerificationCodesService } from './verification-codes.service';
import { PermissionLevel } from 'src/common/decorator/permission-level.decorator';
import { User } from 'src/users/users.decorator';
import * as usersSchema from 'src/users/users.schema';
import { UserRole } from 'src/types';

@ApiTags('Codes et Verification')
@Controller('verification-codes')
export class VerificationCodesController {
  constructor(private readonly verifCodeServ: VerificationCodesService) {}

  @PermissionLevel(Object.values(UserRole))
  @Post('send')
  @HttpCode(200)
  @ApiOperation({ summary: 'Envoyer un code de vérification' })
  @ApiOkResponse({ description: 'Code de vérification envoyé avec succès' })
  @ApiUnauthorizedResponse({
    description: 'Veillez patienter avant de redemander un nouveau code',
  })
  @ApiConflictResponse({ description: "L'utilisateur est deja verifier" })
  async sendVerificationCode(@User() user: usersSchema.UserDocument) {
    await this.verifCodeServ.createVerificationCode(user);
    return {
      StatusCode: HttpStatus.OK,
      message: 'Verification code sent successfully',
    };
  }

  @PermissionLevel(Object.values(UserRole))
  @Post('verify')
  @HttpCode(200)
  @ApiOperation({ summary: 'Vérifier un code de vérification' })
  @ApiOkResponse({
    description: 'Code de vérification vérifié avec succès',
    example: {
      StatusCode: HttpStatus.OK,
      message: 'Verification code confirmed successfully',
      data: {
        token: 'user Token',
      },
    },
  })
  @ApiUnauthorizedResponse({
    description: 'Code de confirmation invalide',
  })
  @ApiConflictResponse({ description: "L'utilisateur est deja verifier" })
  async confirmVerificationCode(
    @User() user: usersSchema.UserDocument,
    @Query('code') code: string,
  ) {
    const token = await this.verifCodeServ.confirmVerificationCode(
      user,
      parseInt(code),
    );

    return {
      StatusCode: HttpStatus.OK,
      message: 'Verification code confirmed successfully',
      data: {
        token,
      },
    };
  }
}

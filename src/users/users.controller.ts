import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import {
  ApiAcceptedResponse,
  ApiForbiddenResponse,
  ApiNotFoundResponse,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { LoginUserInfoDto } from './dto/login-user-info.dto';
import { AuthPayload } from 'src/auth/auth.service';
import { EditUserProfilDto } from './dto/edit-user-profil.dto';
import { EditUserInfoDto } from './dto/edit-user-info.dto';
import { ApiUseBearer } from 'src/common/decorator/request-config.decorator';
import { PermissionLevel } from 'src/common/decorator/permission-level.decorator';
import { Role } from 'src/common/enums/role.enum';
import { User } from './users.decorator';
import * as usersSchema from './users.schema';
import { FileInterceptor } from '@nestjs/platform-express';

@ApiTags('Users')
@Controller('users')
export class UsersController {
  constructor(private readonly UsersService: UsersService) {}

  @HttpCode(201)
  @Post('register')
  @ApiOperation({ summary: 'Enregistrer un nouvel utilisateur' })
  @ApiResponse({
    status: 201,
    description: 'Utilisateur enregistré avec succès',
    schema: {
      example: {
        statusCode: 201,
        message: 'User created successfully',
        data: { token: 'jwt_token' },
      },
    },
  })
  @ApiResponse({
    status: 400,
    description:
      "Erreur lors de l'enregistrement (champs manquants ou invalides)",
  })
  @ApiResponse({
    status: 409,
    description: "L'utilisateur existe déjà",
  })
  async registerUser(
    @Body()
    user: CreateUserDto,
  ) {
    const token = await this.UsersService.registerUser(user);

    return {
      statusCode: HttpStatus.CREATED,
      message: 'User created successfully',
      data: { token },
    };
  }

  @Post('login')
  @HttpCode(200)
  @ApiOperation({ summary: 'Se connecter avec un utilisateur' })
  @ApiResponse({
    status: 200,
    description: 'Utilisateur connecté avec succès',
    schema: {
      example: {
        statusCode: 200,
        message: 'User logged in successfully',
        data: { token: 'jwt_token' },
      },
    },
  })
  @ApiResponse({
    status: 400,
    description: 'Identifiants invalides',
  })
  @ApiResponse({
    status: 404,
    description: "L'utilisateur n'existe pas",
  })
  async login(@Body() user: LoginUserInfoDto) {
    const token = await this.UsersService.userLogin(user);

    return {
      statusCode: HttpStatus.OK,
      message: 'User logged in successfully',
      data: { token },
    };
  }

  @Get(':id')
  @HttpCode(200)
  @ApiOperation({ summary: 'Récupérer un utilisateur par son ID' })
  @ApiResponse({
    status: 200,
    description: 'Utilisateur récupéré avec succès',
    schema: {
      example: {
        statusCode: 200,
        message: 'User fetched successfully',
        data: null,
      },
    },
  })
  @ApiResponse({
    status: 404,
    description: "L'utilisateur n'existe pas",
  })
  async getUserById(@Param('id') id: string) {
    const user = await this.UsersService.getUserById(id);

    return {
      statusCode: HttpStatus.OK,
      message: 'User fetched successfully',
      data: user as AuthPayload,
    };
  }

  @PermissionLevel([Role.ADMIN, Role.APPLICANT, Role.MANAGER, Role.USER])
  @Post('me/edit')
  @HttpCode(HttpStatus.ACCEPTED)
  @ApiOperation({ summary: "Mettre à jour les informations d'un utilisateur" })
  @ApiAcceptedResponse({
    description: 'Les informations ont ete mises a jours',
  })
  @ApiNotFoundResponse({ description: "L'utilisateur n'existe pas" })
  @ApiForbiddenResponse({
    description: "Vous n'êtes pas autorisé à effectuer cette action",
  })
  async editUserInfo(
    @User() user: usersSchema.UserDocument,
    @Body() userInfo: EditUserInfoDto,
  ) {
    const token = await this.UsersService.editUserInfo(user, userInfo);

    return {
      statusCode: HttpStatus.ACCEPTED,
      message: 'User info updated successfully',
      data: { token },
    };
  }

  @PermissionLevel([Role.ADMIN, Role.APPLICANT, Role.MANAGER, Role.USER])
  @Post('me/update-profil')
  @HttpCode(202)
  @UseInterceptors(FileInterceptor('picture'))
  @ApiOperation({ summary: "Mettre à jour le profil d'un utilisateur" })
  @ApiResponse({
    status: 202,
    description: 'Profil utilisateur mis à jour avec succès',
  })
  @ApiResponse({
    status: 404,
    description: "L'utilisateur n'existe pas",
  })
  async updateUserProfil(
    @User() user: usersSchema.UserDocument,
    @Body() userProfil: EditUserProfilDto,
    @UploadedFile() picture?: Express.Multer.File,
  ) {
    const token = await this.UsersService.editUserProfile(
      user,
      userProfil,
      picture,
    );

    return {
      statusCode: HttpStatus.ACCEPTED,
      message: 'User profile updated successfully',
      data: { token },
    };
  }

  @PermissionLevel([Role.ADMIN, Role.APPLICANT, Role.MANAGER, Role.USER])
  @Post('me/request-password-reset')
  @HttpCode(202)
  @ApiUseBearer()
  @ApiOperation({ summary: 'Demander la réinitialisation du mot de passe' })
  @ApiResponse({
    status: 202,
    description: 'Demande de réinitialisation du mot de passe acceptée',
  })
  @ApiResponse({
    status: 404,
    description: "L'utilisateur n'existe pas ou ",
  })
  @ApiResponse({
    status: 401,
    description: 'Demande déjà existante, veuillez patienter',
  })
  async requestPasswordReset(@User() user: usersSchema.UserDocument) {
    await this.UsersService.requestPasswordReset(user);

    return {
      statusCode: HttpStatus.ACCEPTED,
      message: 'Password reset requested successfully',
    };
  }
}

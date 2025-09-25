import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { LoginUserInfoDto } from './dto/login-user-info.dto';
import { AuthPayload } from 'src/auth/auth.service';
import { EditUserProfilDto } from './dto/edit-user-profil.dto';

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

  @Post(':id/update-profil')
  @HttpCode(202)
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
    @Param('id') id: string,
    @Body() userProfil: EditUserProfilDto,
  ) {
    const token = await this.UsersService.editUserProfile(id, userProfil);

    return {
      statusCode: HttpStatus.ACCEPTED,
      message: 'User profile updated successfully',
      data: { token },
    };
  }
}

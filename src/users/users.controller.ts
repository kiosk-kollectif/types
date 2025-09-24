import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('users')
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
}

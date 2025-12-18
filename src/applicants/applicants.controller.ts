import {
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Query,
  Req,
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiCreatedResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { ApplicantsService } from './applicants.service';
import { PermissionLevel } from 'src/common/decorator/permission-level.decorator';
import * as usersSchema from 'src/users/users.schema';
import { ApplicantRequestStatus, UserRole } from 'src/types';
import { User } from 'src/users/users.decorator';
import { ApplicantRequestUpdateRequestQueryDto } from './dto/applicant-request-update-request.dto';

@ApiTags('Gerer les requetes des deposant')
@Controller('applicants')
export class ApplicantsController {
  constructor(private readonly applicantService: ApplicantsService) {}

  @PermissionLevel([UserRole.USER])
  @Post('requests')
  @ApiOperation({ summary: 'Envoyer une requete' })
  @ApiCreatedResponse({ description: 'Requete envoyée' })
  async addApplicantRequest(
    @Req() req: Request & { user: usersSchema.UserDocument },
  ) {
    const user: usersSchema.UserDocument = req.user;

    const status = await this.applicantService.postRequest(user);

    return {
      StatusCode: HttpStatus.CREATED,
      message: 'Request sended',
      data: {
        status,
      },
    };
  }

  @PermissionLevel([UserRole.USER, UserRole.APPLICANT])
  @Get('request-status')
  @ApiOperation({ summary: "Recuperer le status d'une requete" })
  @ApiOkResponse({ description: 'Reponse a la requete' })
  async getApplicantRequestStatus(@User() user: usersSchema.UserDocument) {
    const status = await this.applicantService.getUserRequestStatus(user);
    return {
      StatusCode: HttpStatus.OK,
      message: 'Here you are',
      data: {
        status,
      },
    };
  }

  @PermissionLevel([UserRole.ADMIN, UserRole.MANAGER])
  @Get('requests')
  @ApiOperation({ summary: 'Obtenir les requetes' })
  @ApiOkResponse({ description: 'Liste des requetes' })
  async getRequest(@Query('status') status?: ApplicantRequestStatus) {
    const requests = await this.applicantService.getRequests(status);

    return {
      StatusCode: HttpStatus.OK,
      message: 'Requests',
      data: {
        requests,
      },
    };
  }

  @PermissionLevel([UserRole.ADMIN, UserRole.MANAGER])
  @Post('requests/:id/update')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Modifier une requete' })
  @ApiNotFoundResponse({ description: 'Requete non trouvée' })
  @ApiBadRequestResponse({ description: 'status incorrect' })
  @ApiOkResponse({ description: 'Requete modifiée' })
  async updateRequest(
    @Param('id') id: string,
    @Query() query: ApplicantRequestUpdateRequestQueryDto,
  ) {
    const request = await this.applicantService.updateRequest(id, query.status);

    return {
      StatusCode: HttpStatus.OK,
      message: 'Request updated',
      data: { request },
    };
  }

  //Requete d'un applicant  pour ses donnees
  @Get('me/tools')
  @PermissionLevel([UserRole.APPLICANT])
  @ApiOperation({ summary: "Recuperer les outils d'un deposant" })
  async getApplicantsTools(@User() user: usersSchema.UserDocument) {
    const tools = await this.applicantService.getApplicantTools(user);

    return {
      StatusCode: HttpStatus.OK,
      message: 'Here you are',
      data: {
        tools,
        length: tools.length,
      },
    };
  }

  @Get('me/rentals')
  @PermissionLevel([UserRole.APPLICANT])
  @ApiOperation({ summary: "Recuperer les locations des outils d'un deposant" })
  async getApplicantsRentals(@User() user: usersSchema.UserDocument) {
    const rentals = await this.applicantService.getApplicantRentalsInfo(user);

    return {
      StatusCode: HttpStatus.OK,
      message: 'Here you are',
      data: rentals,
    };
  }
}

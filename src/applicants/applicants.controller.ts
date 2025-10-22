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
import { UserDocument } from 'src/users/users.schema';
import { ApplicantRequestStatus } from 'src/common/enums/applicant-request-status.enum';
import { UserRole } from 'src/types';

@ApiTags('Gerer les requetes des deposant')
@Controller('applicants')
export class ApplicantsController {
  constructor(private readonly applicantService: ApplicantsService) {}

  @PermissionLevel([UserRole.USER])
  @Post('requests')
  @ApiOperation({ summary: 'Envoyer une requete' })
  @ApiCreatedResponse({ description: 'Requete envoyée' })
  async addApplicantRequest(@Req() req: Request & { user: UserDocument }) {
    const user: UserDocument = req.user;

    const request = await this.applicantService.postRequest(user);

    return {
      StatusCode: HttpStatus.CREATED,
      message: 'Request sended',
      data: {
        request,
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
    @Query('status') status: ApplicantRequestStatus,
  ) {
    const request = await this.applicantService.updateRequest(id, status);

    return {
      StatusCode: HttpStatus.OK,
      message: 'Request updated',
      data: { request },
    };
  }
}

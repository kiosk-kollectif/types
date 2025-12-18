/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { Transform } from 'class-transformer';
import { IsEnum } from 'class-validator';
import { ApplicantRequestStatus } from 'src/types';

export class ApplicantRequestUpdateRequestQueryDto {
  @IsEnum(ApplicantRequestStatus)
  @Transform(({ value }) => value?.toLowerCase())
  status: ApplicantRequestStatus;
}

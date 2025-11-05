import { SetMetadata } from '@nestjs/common';
import { INVALIDE_TOKEN_DECORATOR_KEY } from '../utils/constants';

export const InvalidateToken = () =>
  SetMetadata(INVALIDE_TOKEN_DECORATOR_KEY, true);

import { applyDecorators } from '@nestjs/common';
import { ApiNotFoundResponse } from '@nestjs/swagger';

export const CategorieNotFoundResponse = () => {
  return applyDecorators(
    ApiNotFoundResponse({ description: 'Categorie not found' }),
  );
};

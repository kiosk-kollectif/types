import { ApiHeader } from '@nestjs/swagger';

export const ApiUseBearer = (): MethodDecorator & ClassDecorator => {
  return ApiHeader({
    name: 'Authorization',
    description: "Utilisation d'un token JWT",
    example: 'Bearer <token>',
    required: true,
  });
};

import { Module } from '@nestjs/common';
import { InvalidesTokenService } from './invalides-token.service';
import { MongooseModule } from '@nestjs/mongoose';
import { InvalideTokens, InvalideTokensSchema } from './invalides-token-schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: InvalideTokens.name,
        schema: InvalideTokensSchema,
      },
    ]),
  ],
  providers: [InvalidesTokenService],
  exports: [InvalidesTokenService],
})
export class InvalidesTokenModule {}

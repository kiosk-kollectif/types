import { Module } from '@nestjs/common';
import { ToolsCategoriesController } from './tools-categories.controller';
import { ToolsCategoriesService } from './tools-categories.service';
import { MongooseModule } from '@nestjs/mongoose';
import {
  ToolsCategories,
  ToolsCategoriesSchema,
} from './tools-categories.schema';
import { AuthModule } from 'src/auth/auth.module';
import { InvalidesTokenModule } from 'src/invalides-token/invalides-token.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: ToolsCategories.name, schema: ToolsCategoriesSchema },
    ]),
    AuthModule,
    InvalidesTokenModule,
  ],
  controllers: [ToolsCategoriesController],
  providers: [ToolsCategoriesService],
  exports: [ToolsCategoriesService],
})
export class ToolsCategoriesModule {}

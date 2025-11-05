import { Module } from '@nestjs/common';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { VerificationCodesModule } from './verification-codes/verification-codes.module';
import { WarehousesModule } from './warehouses/warehouses.module';
import { AdminsModule } from './admins/admins.module';
import { ToolsCategoriesModule } from './tools-categories/tools-categories.module';
import { ToolsModule } from './tools/tools.module';
import { ApplicantsModule } from './applicants/applicants.module';
import { InvalidesTokenModule } from './invalides-token/invalides-token.module';
import { InvalideTokenInterceptor } from 'src/invalides-token/invalides-token.interceptor';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    MongooseModule.forRoot(process.env.MONGODB_URI as string),
    UsersModule,
    AuthModule,
    VerificationCodesModule,
    WarehousesModule,
    AdminsModule,
    ToolsCategoriesModule,
    ToolsModule,
    ApplicantsModule,
    InvalidesTokenModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    { provide: APP_INTERCEPTOR, useClass: InvalideTokenInterceptor },
  ],
})
export class AppModule {}

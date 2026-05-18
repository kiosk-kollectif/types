import { Module } from '@nestjs/common';
import { ManagersService } from './managers.service';
import { ManagersController } from './managers.controller';
import { UsersModule } from 'src/users/users.module';
import { AuthModule } from 'src/auth/auth.module';
import { InvalidesTokenModule } from 'src/invalides-token/invalides-token.module';
import { MailerModule } from 'src/mailer/mailer.module';

@Module({
  imports: [UsersModule, AuthModule, InvalidesTokenModule, MailerModule],
  controllers: [ManagersController],
  providers: [ManagersService],
})
export class ManagersModule {}

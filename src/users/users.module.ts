import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserProfil, UserProfilSchema, UserSchema } from './users.schema';
import { AuthModule } from 'src/auth/auth.module';
import {
  ResetPasswordRequest,
  ResetPasswordRequestSchema,
} from './reset-password-request.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      { name: ResetPasswordRequest.name, schema: ResetPasswordRequestSchema },
      { name: UserProfil.name, schema: UserProfilSchema },
    ]),
    AuthModule,
  ],
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule {}

import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './auth.strategy';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { OwnerRequestGuard } from './owner-request.guard';
import { PermissionLevelGuard } from './permission-level.guard';
import { JWT_TOKEN_EXPIRATION } from 'src/common/utils/constants';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from 'src/users/users.schema';
import { InvalidesTokenModule } from 'src/invalides-token/invalides-token.module';

@Module({
  imports: [
    PassportModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        return {
          secret: configService.get('JWT_SECRET') as string,
          signOptions: { expiresIn: JWT_TOKEN_EXPIRATION },
        };
      },
    }),
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    InvalidesTokenModule,
  ],
  providers: [
    AuthService,
    JwtStrategy,
    OwnerRequestGuard,
    PermissionLevelGuard,
  ],
  exports: [AuthService, MongooseModule],
})
export class AuthModule {}

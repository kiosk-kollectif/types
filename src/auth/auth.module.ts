import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './auth.strategy';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { OwnerRequestGuard } from './owner-request.guard';
import { PermissionLevelGuard } from './permission-level.guard';
import { JWT_TOKEN_EXPIRATION } from 'src/common/utils/constants';

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
  ],
  providers: [
    AuthService,
    JwtStrategy,
    OwnerRequestGuard,
    PermissionLevelGuard,
  ],
  exports: [AuthService],
})
export class AuthModule {}

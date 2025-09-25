import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './auth.strategy';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { OwnerRequestGuard } from './owner.guard';

@Module({
  imports: [
    PassportModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        return {
          secret: configService.get('JWT_SECRET') as string,
          signOptions: { expiresIn: '7d' },
        };
      },
    }),
  ],
  providers: [AuthService, JwtStrategy, OwnerRequestGuard],
  exports: [AuthService],
})
export class AuthModule {}

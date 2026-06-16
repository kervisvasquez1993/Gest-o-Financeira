// src/modules/auth/auth.module.ts
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule, JwtModuleOptions } from '@nestjs/jwt';
import type { StringValue } from 'ms';
import { UsersModule } from '../users/users.module';
import { LoginUseCase } from './application/use-cases/login.use-case';
import { RegisterUseCase } from './application/use-cases/register.use-case';
import { Hasher } from './domain/ports/hasher.port';
import { TokenProvider } from './domain/ports/token-provider.port';
import { BcryptHasher } from './infrastructure/hashing/bcrypt-hasher';
import { JwtTokenProvider } from './infrastructure/token/jwt-token.provider';
import { AuthController } from './presentation/auth.controller';

@Module({
  imports: [
    UsersModule,
    JwtModule.registerAsync({
      global: true,
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService): JwtModuleOptions => ({
        secret: config.getOrThrow<string>('JWT_SECRET'),
        signOptions: {
          expiresIn: config.get<string>('JWT_EXPIRES_IN', '1d') as StringValue,
        },
      }),
    }),
  ],
  controllers: [AuthController],
  providers: [
    { provide: Hasher, useClass: BcryptHasher },
    { provide: TokenProvider, useClass: JwtTokenProvider },
    RegisterUseCase,
    LoginUseCase,
  ],
})
export class AuthModule {}
import { Module } from '@nestjs/common';
import { JwtModule, JwtModuleOptions } from '@nestjs/jwt';
import type { StringValue } from 'ms';
import { envs } from '../../config/envs';
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
    JwtModule.register({
      global: true,
      secret: envs.jwt.secret,
      signOptions: { expiresIn: envs.jwt.expiresIn as StringValue },
    } as JwtModuleOptions),
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
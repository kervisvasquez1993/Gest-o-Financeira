import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { User } from './domain/entities/user.entity';
import { UserRepository } from './domain/ports/user-repository.port';
import { TypeOrmUserRepository } from './infrastructure/repositories/typeorm-user.repository';
import { UserController } from './presentation/user.controller';
import { GetUserByIdUseCase } from './application/use-cases/get-user-by-id.use-case';


@Module({
  imports: [TypeOrmModule.forFeature([User])],
  controllers: [UserController],
  providers: [
    { provide: UserRepository, useClass: TypeOrmUserRepository },
    GetUserByIdUseCase,
  ],
  exports: [UserRepository],
})
export class UsersModule {}
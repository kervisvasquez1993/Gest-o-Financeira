import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Transaction } from '../transactions/domain/entities/transaction.entity';
import { GetDashboardUseCase } from './application/use-cases/get-dashboard.use-case';
import { DashboardRepository } from './domain/ports/dashboard-repository.port';
import { TypeOrmDashboardRepository } from './infrastructure/repositories/typeorm-dashboard.repository';
import { DashboardController } from './presentation/dashboard.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Transaction])],
  controllers: [DashboardController],
  providers: [
    { provide: DashboardRepository, useClass: TypeOrmDashboardRepository },
    GetDashboardUseCase,
  ],
})
export class DashboardModule {}
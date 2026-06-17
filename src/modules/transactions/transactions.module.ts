import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CategoriesModule } from '../categories/categories.module';
import { CreateTransactionUseCase } from './application/use-cases/create-transaction.use-case';
import { DeleteTransactionUseCase } from './application/use-cases/delete-transaction.use-case';
import { GetTransactionByIdUseCase } from './application/use-cases/get-transaction-by-id.use-case';
import { ListTransactionsUseCase } from './application/use-cases/list-transactions.use-case';
import { UpdateTransactionUseCase } from './application/use-cases/update-transaction.use-case';
import { Transaction } from './domain/entities/transaction.entity';
import { TransactionRepository } from './domain/ports/transaction-repository.port';
import { TypeOrmTransactionRepository } from './infrastructure/repositories/typeorm-transaction.repository';
import { TransactionController } from './presentation/transaction.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Transaction]), CategoriesModule],
  controllers: [TransactionController],
  providers: [
    { provide: TransactionRepository, useClass: TypeOrmTransactionRepository },
    CreateTransactionUseCase,
    ListTransactionsUseCase,
    GetTransactionByIdUseCase,
    UpdateTransactionUseCase,
    DeleteTransactionUseCase,
  ],
  exports: [TransactionRepository],
})
export class TransactionsModule {}
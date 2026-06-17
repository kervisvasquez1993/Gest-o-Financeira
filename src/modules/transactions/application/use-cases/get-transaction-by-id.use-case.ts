import { Injectable } from '@nestjs/common';
import { Transaction } from '../../domain/entities/transaction.entity';
import { TransactionNotFoundError } from '../../domain/errors/transaction-not-found.error';
import { TransactionRepository } from '../../domain/ports/transaction-repository.port';

@Injectable()
export class GetTransactionByIdUseCase {
  constructor(private readonly repository: TransactionRepository) {}

  async execute(id: string, userId: string): Promise<Transaction> {
    const transaction = await this.repository.findByIdAndUser(id, userId);
    if (!transaction) throw new TransactionNotFoundError(id);
    return transaction;
  }
}
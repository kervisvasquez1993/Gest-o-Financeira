import { Injectable } from '@nestjs/common';
import { TransactionNotFoundError } from '../../domain/errors/transaction-not-found.error';
import { TransactionRepository } from '../../domain/ports/transaction-repository.port';

@Injectable()
export class DeleteTransactionUseCase {
  constructor(private readonly repository: TransactionRepository) {}

  async execute(id: string, userId: string): Promise<{ message: string }> {
    const transaction = await this.repository.findByIdAndUser(id, userId);
    if (!transaction) throw new TransactionNotFoundError(id);

    await this.repository.delete(transaction);
    return { message: 'Transacción eliminada exitosamente.' };
  }
}
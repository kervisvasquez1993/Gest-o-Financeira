import { Injectable } from '@nestjs/common';
import { CategoryRepository } from '../../../categories/domain/ports/category-repository.port';
import { CategoryNotFoundError } from '../../../categories/domain/errors/category-not-found.error';
import { Transaction } from '../../domain/entities/transaction.entity';
import { TransactionNotFoundError } from '../../domain/errors/transaction-not-found.error';
import { TransactionRepository } from '../../domain/ports/transaction-repository.port';
import { UpdateTransactionDto } from '../dtos/update-transaction.dto';

@Injectable()
export class UpdateTransactionUseCase {
  constructor(
    private readonly repository: TransactionRepository,
    private readonly categoryRepository: CategoryRepository,
  ) {}

  async execute(id: string, dto: UpdateTransactionDto, userId: string): Promise<Transaction> {
    const transaction = await this.repository.findByIdAndUser(id, userId);
    if (!transaction) throw new TransactionNotFoundError(id);

    if (dto.categoryId && dto.categoryId !== transaction.categoryId) {
      const category = await this.categoryRepository.findByIdAndUser(dto.categoryId, userId);
      if (!category) throw new CategoryNotFoundError(dto.categoryId);
    }

    return this.repository.update(transaction, dto);
  }
}
import { Injectable } from '@nestjs/common';
import { CategoryRepository } from '../../../categories/domain/ports/category-repository.port';
import { CategoryNotFoundError } from '../../../categories/domain/errors/category-not-found.error';
import { Transaction } from '../../domain/entities/transaction.entity';
import { TransactionRepository } from '../../domain/ports/transaction-repository.port';
import { CreateTransactionDto } from '../dtos/create-transaction.dto';

@Injectable()
export class CreateTransactionUseCase {
  constructor(
    private readonly repository: TransactionRepository,
    private readonly categoryRepository: CategoryRepository,
  ) {}

  async execute(dto: CreateTransactionDto, userId: string): Promise<Transaction> {
    const category = await this.categoryRepository.findByIdAndUser(dto.categoryId, userId);
    if (!category) throw new CategoryNotFoundError(dto.categoryId);

    return this.repository.create({
      description: dto.description,
      amount: dto.amount,
      type: dto.type,
      date: dto.date,
      categoryId: dto.categoryId,
      userId,
    });
  }
}
import { Injectable } from '@nestjs/common';
import { PaginatedResponse } from '../../../../shared/responses/paginated.response';
import { Transaction } from '../../domain/entities/transaction.entity';
import { TransactionRepository } from '../../domain/ports/transaction-repository.port';
import { FilterTransactionsDto } from '../dtos/filter-transactions.dto';

@Injectable()
export class ListTransactionsUseCase {
  constructor(private readonly repository: TransactionRepository) {}

  async execute(
    filters: FilterTransactionsDto,
    userId: string,
  ): Promise<PaginatedResponse<Transaction>> {
    const { page, limit } = filters;
    const [data, total] = await this.repository.findManyByUser({
      userId,
      type: filters.type,
      categoryId: filters.categoryId,
      startDate: filters.startDate,
      endDate: filters.endDate,
      page,
      limit,
    });

    return {
      data,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit) || 1,
      },
    };
  }
}
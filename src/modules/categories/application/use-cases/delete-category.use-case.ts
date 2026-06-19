
import { Injectable } from '@nestjs/common';
import { CategoryRepository } from '../../domain/ports/category-repository.port';
import { CategoryNotFoundError } from '../../domain/errors/category-not-found.error';
import { CategoryHasTransactionsError } from '../../domain/errors/category-has-transactions.error';

@Injectable()
export class DeleteCategoryUseCase {
  constructor(private readonly repository: CategoryRepository) {}

  async execute(id: string, userId: string): Promise<{ message: string }> {
    const category = await this.repository.findByIdAndUser(id, userId);
    if (!category) throw new CategoryNotFoundError(id);

    const transactionsCount = await this.repository.countTransactions(id);
    if (transactionsCount > 0) throw new CategoryHasTransactionsError();

    await this.repository.delete(category);
    return { message: 'Categoría eliminada exitosamente.' };
  }
}
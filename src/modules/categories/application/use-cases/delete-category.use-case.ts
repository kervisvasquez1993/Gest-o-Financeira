import { Injectable } from '@nestjs/common';

import { CategoryRepository } from '../../domain/ports/category-repository.port';
import { CategoryNotFoundError } from '../../domain/ports/errors/category-not-found.error';

@Injectable()
export class DeleteCategoryUseCase {
  constructor(private readonly repository: CategoryRepository) {}

  async execute(id: string, userId: string): Promise<void> {
    const category = await this.repository.findByIdAndUser(id, userId);
    if (!category) throw new CategoryNotFoundError(id);
    await this.repository.delete(category);
  }
}
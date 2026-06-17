// src/modules/categories/application/use-cases/delete-category.use-case.ts
import { Injectable } from '@nestjs/common';

import { CategoryRepository } from '../../domain/ports/category-repository.port';
import { CategoryNotFoundError } from '../../domain/errors/category-not-found.error';

@Injectable()
export class DeleteCategoryUseCase {
  constructor(private readonly repository: CategoryRepository) {}

  async execute(id: string, userId: string): Promise<{ message: string }> {
    const category = await this.repository.findByIdAndUser(id, userId);
    if (!category) throw new CategoryNotFoundError(id);

    await this.repository.delete(category);
    return { message: 'Categoría eliminada exitosamente.' };
  }
}
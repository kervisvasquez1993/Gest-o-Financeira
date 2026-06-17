import { Injectable } from '@nestjs/common';
import { Category } from '../../domain/entities/category.entity';

import { CategoryRepository } from '../../domain/ports/category-repository.port';
import { CategoryNotFoundError } from '../../domain/errors/category-not-found.error';

@Injectable()
export class GetCategoryByIdUseCase {
  constructor(private readonly repository: CategoryRepository) {}

  async execute(id: string, userId: string): Promise<Category> {
    const category = await this.repository.findByIdAndUser(id, userId);
    if (!category) throw new CategoryNotFoundError(id);
    return category;
  }
}
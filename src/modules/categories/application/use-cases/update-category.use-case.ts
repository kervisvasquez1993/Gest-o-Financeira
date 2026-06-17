
import { Injectable } from '@nestjs/common';
import { Category } from '../../domain/entities/category.entity';

import { CategoryRepository } from '../../domain/ports/category-repository.port';
import { UpdateCategoryDto } from '../dtos/update-category.dto';
import { CategoryNotFoundError } from '../../domain/ports/errors/category-not-found.error';

@Injectable()
export class UpdateCategoryUseCase {
  constructor(private readonly repository: CategoryRepository) {}

  async execute(id: string, dto: UpdateCategoryDto, userId: string): Promise<Category> {
    const category = await this.repository.findByIdAndUser(id, userId);
    if (!category) throw new CategoryNotFoundError(id);
    return this.repository.update(category, dto);
  }
}
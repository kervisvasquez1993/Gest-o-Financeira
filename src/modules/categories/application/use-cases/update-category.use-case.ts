// src/modules/categories/application/use-cases/update-category.use-case.ts
import { Injectable } from '@nestjs/common';
import { Category } from '../../domain/entities/category.entity';
import { CategoryNameAlreadyExistsError } from '../../domain/errors/category-name-already-exists.error';

import { CategoryRepository } from '../../domain/ports/category-repository.port';
import { UpdateCategoryDto } from '../dtos/update-category.dto';
import { CategoryNotFoundError } from '../../domain/errors/category-not-found.error';

@Injectable()
export class UpdateCategoryUseCase {
  constructor(private readonly repository: CategoryRepository) {}

  async execute(id: string, dto: UpdateCategoryDto, userId: string): Promise<Category> {
    const category = await this.repository.findByIdAndUser(id, userId);
    if (!category) throw new CategoryNotFoundError(id);

    if (dto.name && dto.name !== category.name) {
      const existing = await this.repository.findByNameAndUser(dto.name, userId);
      if (existing && existing.id !== id) {
        throw new CategoryNameAlreadyExistsError(dto.name);
      }
    }

    return this.repository.update(category, dto);
  }
}
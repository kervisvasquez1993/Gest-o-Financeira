import { Injectable } from '@nestjs/common';
import { Category } from '../../domain/entities/category.entity';
import { CategoryNameAlreadyExistsError } from '../../domain/errors/category-name-already-exists.error';
import { CategoryRepository } from '../../domain/ports/category-repository.port';
import { CreateCategoryDto } from '../dtos/create-category.dto';

@Injectable()
export class CreateCategoryUseCase {
  constructor(private readonly repository: CategoryRepository) {}

  async execute(dto: CreateCategoryDto, userId: string): Promise<Category> {
    const existing = await this.repository.findByNameAndUser(dto.name, userId);
    if (existing) throw new CategoryNameAlreadyExistsError(dto.name);

    return this.repository.create({
      name: dto.name,
      description: dto.description ?? null,
      userId,
    });
  }
}
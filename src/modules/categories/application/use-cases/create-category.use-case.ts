import { Injectable } from '@nestjs/common';
import { Category } from '../../domain/entities/category.entity';
import { CategoryRepository } from '../../domain/ports/category-repository.port';
import { CreateCategoryDto } from '../dtos/create-category.dto';

@Injectable()
export class CreateCategoryUseCase {
  constructor(private readonly repository: CategoryRepository) {}

  execute(dto: CreateCategoryDto, userId: string): Promise<Category> {
    return this.repository.create({
      name: dto.name,
      description: dto.description ?? null,
      userId,
    });
  }
}
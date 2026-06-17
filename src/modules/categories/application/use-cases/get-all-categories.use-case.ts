import { Injectable } from '@nestjs/common';
import { Category } from '../../domain/entities/category.entity';
import { CategoryRepository } from '../../domain/ports/category-repository.port';

@Injectable()
export class GetAllCategoriesUseCase {
  constructor(private readonly repository: CategoryRepository) {}

  execute(userId: string): Promise<Category[]> {
    return this.repository.findAllByUser(userId);
  }
}
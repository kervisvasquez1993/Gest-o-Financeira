import { Injectable } from '@nestjs/common';
import {
  CategoryRepository,
  CategoryWithStats,
} from '../../domain/ports/category-repository.port';

@Injectable()
export class GetCategoriesSummaryUseCase {
  constructor(private readonly repository: CategoryRepository) {}

  execute(userId: string): Promise<CategoryWithStats[]> {
    return this.repository.findAllByUserWithStats(userId);
  }
}
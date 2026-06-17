import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Category } from '../../domain/entities/category.entity';
import {
  CategoryRepository,
  CreateCategoryData,
  UpdateCategoryData,
} from '../../domain/ports/category-repository.port';

@Injectable()
export class TypeOrmCategoryRepository extends CategoryRepository {
  constructor(
    @InjectRepository(Category)
    private readonly repository: Repository<Category>,
  ) {
    super();
  }

  findAllByUser(userId: string): Promise<Category[]> {
    return this.repository.find({
      where: { userId },
      order: { createdAt: 'DESC' },
    });
  }

  findByIdAndUser(id: string, userId: string): Promise<Category | null> {
    return this.repository.findOne({ where: { id, userId } });
  }

  create(data: CreateCategoryData): Promise<Category> {
    const category = this.repository.create(data);
    return this.repository.save(category);
  }

  update(category: Category, data: UpdateCategoryData): Promise<Category> {
    this.repository.merge(category, data);
    return this.repository.save(category);
  }

  async delete(category: Category): Promise<void> {
    await this.repository.remove(category);
  }
}
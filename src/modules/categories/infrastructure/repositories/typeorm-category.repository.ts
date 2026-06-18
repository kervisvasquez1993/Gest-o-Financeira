// src/modules/categories/infrastructure/repositories/typeorm-category.repository.ts
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Category } from '../../domain/entities/category.entity';
import {
  CategoryRepository,
  CategoryWithStats,
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

  findByNameAndUser(name: string, userId: string): Promise<Category | null> {
    return this.repository.findOne({ where: { name, userId } });
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
  async findAllByUserWithStats(userId: string): Promise<CategoryWithStats[]> {
    const rows = await this.repository
      .createQueryBuilder('c')
      .leftJoin('transactions', 't', 't.category_id = c.id')
      .select('c.id', 'id')
      .addSelect('c.name', 'name')
      .addSelect('c.description', 'description')
      .addSelect('c.created_at', 'createdAt')
      .addSelect('c.updated_at', 'updatedAt')
      .addSelect('COUNT(t.id)', 'transactionsCount')
      .addSelect(
        `COALESCE(SUM(CASE WHEN t.type = 'entrada' THEN t.amount ELSE 0 END), 0)`,
        'totalEntradas',
      )
      .addSelect(
        `COALESCE(SUM(CASE WHEN t.type = 'saida' THEN t.amount ELSE 0 END), 0)`,
        'totalSaidas',
      )
      .where('c.user_id = :userId', { userId })
      .groupBy('c.id')
      .orderBy('c.created_at', 'DESC')
      .getRawMany<{
        id: string;
        name: string;
        description: string | null;
        createdAt: Date;
        updatedAt: Date;
        transactionsCount: string;
        totalEntradas: string;
        totalSaidas: string;
      }>();

    return rows.map((r) => ({
      id: r.id,
      name: r.name,
      description: r.description,
      transactionsCount: parseInt(r.transactionsCount, 10),
      totalEntradas: parseFloat(r.totalEntradas),
      totalSaidas: parseFloat(r.totalSaidas),
      createdAt: r.createdAt,
      updatedAt: r.updatedAt,
    }));
  }
}

import { Category } from '../entities/category.entity';

export interface CreateCategoryData {
  name: string;
  description?: string | null;
  userId: string;
}

export interface UpdateCategoryData {
  name?: string;
  description?: string | null;
}

export abstract class CategoryRepository {
  abstract findAllByUser(userId: string): Promise<Category[]>;
  abstract findByIdAndUser(id: string, userId: string): Promise<Category | null>;
  abstract create(data: CreateCategoryData): Promise<Category>;
  abstract update(category: Category, data: UpdateCategoryData): Promise<Category>;
  abstract delete(category: Category): Promise<void>;
}
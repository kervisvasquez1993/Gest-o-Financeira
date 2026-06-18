import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CreateCategoryUseCase } from './application/use-cases/create-category.use-case';
import { DeleteCategoryUseCase } from './application/use-cases/delete-category.use-case';
import { GetAllCategoriesUseCase } from './application/use-cases/get-all-categories.use-case';
import { GetCategoryByIdUseCase } from './application/use-cases/get-category-by-id.use-case';
import { UpdateCategoryUseCase } from './application/use-cases/update-category.use-case';
import { Category } from './domain/entities/category.entity';
import { CategoryRepository } from './domain/ports/category-repository.port';
import { TypeOrmCategoryRepository } from './infrastructure/repositories/typeorm-category.repository';
import { CategoryController } from './presentation/category.controller';
import { GetCategoriesSummaryUseCase } from './application/use-cases/get-categories-summary.use-case';

@Module({
  imports: [TypeOrmModule.forFeature([Category])],
  controllers: [CategoryController],
  providers: [
    { provide: CategoryRepository, useClass: TypeOrmCategoryRepository },
    CreateCategoryUseCase,
    UpdateCategoryUseCase,
    DeleteCategoryUseCase,
    GetAllCategoriesUseCase,
    GetCategoryByIdUseCase,
     GetCategoriesSummaryUseCase,
  ],
  exports: [CategoryRepository],
})
export class CategoriesModule {}
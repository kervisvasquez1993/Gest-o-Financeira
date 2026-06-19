// src/modules/categories/domain/errors/category-has-transactions.error.ts
import { ConflictError } from '../../../../shared/errors/domain-error';

export class CategoryHasTransactionsError extends ConflictError {
  constructor() {
    super('Não é possível excluir uma categoria que possui transações associadas.');
  }
}
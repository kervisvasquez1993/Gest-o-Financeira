import { Transaction } from '../entities/transaction.entity';
import { TransactionType } from '../enums/transaction-type.enum';

export interface CreateTransactionData {
  description: string;
  amount: number;
  type: TransactionType;
  date: string;
  categoryId: string;
  userId: string;
}

export interface UpdateTransactionData {
  description?: string;
  amount?: number;
  type?: TransactionType;
  date?: string;
  categoryId?: string;
}

export interface TransactionFilters {
  userId: string;
  type?: TransactionType;
  categoryId?: string;
  startDate?: string;
  endDate?: string;
  page: number;
  limit: number;
}

export abstract class TransactionRepository {
  abstract findManyByUser(filters: TransactionFilters): Promise<[Transaction[], number]>;
  abstract findByIdAndUser(id: string, userId: string): Promise<Transaction | null>;
  abstract create(data: CreateTransactionData): Promise<Transaction>;
  abstract update(transaction: Transaction, data: UpdateTransactionData): Promise<Transaction>;
  abstract delete(transaction: Transaction): Promise<void>;
}
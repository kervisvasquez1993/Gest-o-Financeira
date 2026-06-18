import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Transaction } from '../../domain/entities/transaction.entity';
import {
  CreateTransactionData,
  TransactionFilters,
  TransactionRepository,
  UpdateTransactionData,
} from '../../domain/ports/transaction-repository.port';

@Injectable()
export class TypeOrmTransactionRepository extends TransactionRepository {
  constructor(
    @InjectRepository(Transaction)
    private readonly repository: Repository<Transaction>,
  ) {
    super();
  }

   findManyByUser(filters: TransactionFilters): Promise<[Transaction[], number]> {
    const { userId, type, categoryId, startDate, endDate, search, page, limit } = filters;

    const qb = this.repository
      .createQueryBuilder('t')
      .leftJoinAndSelect('t.category', 'category')
      .where('t.userId = :userId', { userId });

    if (type) qb.andWhere('t.type = :type', { type });
    if (categoryId) qb.andWhere('t.categoryId = :categoryId', { categoryId });
    if (startDate) qb.andWhere('t.date >= :startDate', { startDate });
    if (endDate) qb.andWhere('t.date <= :endDate', { endDate });
    if (search) qb.andWhere('t.description ILIKE :search', { search: `%${search}%` });

    qb.orderBy('t.date', 'DESC')
      .addOrderBy('t.createdAt', 'DESC')
      .skip((page - 1) * limit)
      .take(limit);

    return qb.getManyAndCount();
  }

  findByIdAndUser(id: string, userId: string): Promise<Transaction | null> {
    return this.repository.findOne({
      where: { id, userId },
      relations: { category: true },
    });
  }

  create(data: CreateTransactionData): Promise<Transaction> {
    const transaction = this.repository.create(data);
    return this.repository.save(transaction);
  }

  update(transaction: Transaction, data: UpdateTransactionData): Promise<Transaction> {
    this.repository.merge(transaction, data);
    return this.repository.save(transaction);
  }

  async delete(transaction: Transaction): Promise<void> {
    await this.repository.remove(transaction);
  }
}
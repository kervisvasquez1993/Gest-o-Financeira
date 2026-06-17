import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Transaction } from '../../../transactions/domain/entities/transaction.entity';
import { TransactionType } from '../../../transactions/domain/enums/transaction-type.enum';
import {
  DashboardPeriod,
  DashboardRepository,
  TopCategoryResult,
  TotalsResult,
} from '../../domain/ports/dashboard-repository.port';

@Injectable()
export class TypeOrmDashboardRepository extends DashboardRepository {
  constructor(
    @InjectRepository(Transaction)
    private readonly repository: Repository<Transaction>,
  ) {
    super();
  }

  async getTotals(period: DashboardPeriod): Promise<TotalsResult> {
    const qb = this.repository
      .createQueryBuilder('t')
      .select(
        `COALESCE(SUM(CASE WHEN t.type = :entrada THEN t.amount ELSE 0 END), 0)`,
        'totalEntradas',
      )
      .addSelect(
        `COALESCE(SUM(CASE WHEN t.type = :saida THEN t.amount ELSE 0 END), 0)`,
        'totalSaidas',
      )
      .setParameters({ entrada: TransactionType.ENTRADA, saida: TransactionType.SAIDA })
      .where('t.userId = :userId', { userId: period.userId });

    this.applyPeriod(qb, period);

    const raw = await qb.getRawOne<{ totalEntradas: string; totalSaidas: string }>();
    return {
      totalEntradas: parseFloat(raw?.totalEntradas ?? '0'),
      totalSaidas: parseFloat(raw?.totalSaidas ?? '0'),
    };
  }

  async getTopSaidaCategories(
    period: DashboardPeriod,
    limit: number,
  ): Promise<TopCategoryResult[]> {
    const qb = this.repository
      .createQueryBuilder('t')
      .innerJoin('t.category', 'category')
      .select('category.id', 'categoryId')
      .addSelect('category.name', 'categoryName')
      .addSelect('SUM(t.amount)', 'total')
      .where('t.userId = :userId', { userId: period.userId })
      .andWhere('t.type = :saida', { saida: TransactionType.SAIDA })
      .groupBy('category.id')
      .addGroupBy('category.name')
      .orderBy('total', 'DESC')
      .limit(limit);

    this.applyPeriod(qb, period);

    const rows = await qb.getRawMany<{
      categoryId: string;
      categoryName: string;
      total: string;
    }>();

    return rows.map((r) => ({
      categoryId: r.categoryId,
      categoryName: r.categoryName,
      total: parseFloat(r.total),
    }));
  }

  private applyPeriod(
    qb: ReturnType<Repository<Transaction>['createQueryBuilder']>,
    period: DashboardPeriod,
  ): void {
    if (period.startDate) qb.andWhere('t.date >= :startDate', { startDate: period.startDate });
    if (period.endDate) qb.andWhere('t.date <= :endDate', { endDate: period.endDate });
  }
}
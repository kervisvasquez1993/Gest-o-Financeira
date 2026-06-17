import { Injectable } from '@nestjs/common';
import { DashboardRepository } from '../../domain/ports/dashboard-repository.port';
import { DashboardQueryDto } from '../dtos/dashboard-query.dto';

export interface DashboardResult {
  saldoAtual: number;
  totalEntradas: number;
  totalSaidas: number;
  topCategoriasSaidas: { categoryId: string; categoryName: string; total: number }[];
  periodo: { startDate: string | null; endDate: string | null };
}

@Injectable()
export class GetDashboardUseCase {
  constructor(private readonly repository: DashboardRepository) {}

  async execute(query: DashboardQueryDto, userId: string): Promise<DashboardResult> {
    const period = { userId, startDate: query.startDate, endDate: query.endDate };

    const [totals, topCategorias] = await Promise.all([
      this.repository.getTotals(period),
      this.repository.getTopSaidaCategories(period, 3),
    ]);

    return {
      saldoAtual: Number((totals.totalEntradas - totals.totalSaidas).toFixed(2)),
      totalEntradas: totals.totalEntradas,
      totalSaidas: totals.totalSaidas,
      topCategoriasSaidas: topCategorias,
      periodo: {
        startDate: query.startDate ?? null,
        endDate: query.endDate ?? null,
      },
    };
  }
}
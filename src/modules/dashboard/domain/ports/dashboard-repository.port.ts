export interface DashboardPeriod {
  userId: string;
  startDate?: string;
  endDate?: string;
}

export interface TotalsResult {
  totalEntradas: number;
  totalSaidas: number;
}

export interface TopCategoryResult {
  categoryId: string;
  categoryName: string;
  total: number;
}

export abstract class DashboardRepository {
  abstract getTotals(period: DashboardPeriod): Promise<TotalsResult>;
  abstract getTopSaidaCategories(period: DashboardPeriod, limit: number): Promise<TopCategoryResult[]>;
}
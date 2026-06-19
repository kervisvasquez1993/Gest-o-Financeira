// src/modules/dashboard/application/use-cases/get-dashboard.use-case.spec.ts
import { DashboardRepository } from '../../domain/ports/dashboard-repository.port';
import { GetDashboardUseCase } from './get-dashboard.use-case';

describe('GetDashboardUseCase', () => {
  let useCase: GetDashboardUseCase;
  let repository: jest.Mocked<DashboardRepository>;

  beforeEach(() => {
    repository = {
      getTotals: jest.fn(),
      getTopSaidaCategories: jest.fn(),
    };
    useCase = new GetDashboardUseCase(repository);
  });

  it('calcula o saldo (entradas - saídas) e monta o resultado', async () => {
    repository.getTotals.mockResolvedValue({ totalEntradas: 2500, totalSaidas: 240.4 });
    repository.getTopSaidaCategories.mockResolvedValue([
      { categoryId: 'cat-1', categoryName: 'categoria1', total: 150.5 },
      { categoryId: 'cat-2', categoryName: 'categoria3', total: 89.9 },
    ]);

    const result = await useCase.execute(
      { startDate: '2026-06-01', endDate: '2026-06-30' },
      'user-1',
    );

    expect(result.saldoAtual).toBe(2259.6);
    expect(result.totalEntradas).toBe(2500);
    expect(result.totalSaidas).toBe(240.4);
    expect(result.topCategoriasSaidas).toHaveLength(2);
    expect(result.periodo).toEqual({ startDate: '2026-06-01', endDate: '2026-06-30' });
  });

  it('solicita o top de categorias limitado a 3 e usa null no período sem datas', async () => {
    repository.getTotals.mockResolvedValue({ totalEntradas: 0, totalSaidas: 0 });
    repository.getTopSaidaCategories.mockResolvedValue([]);

    const result = await useCase.execute({}, 'user-1');

    expect(repository.getTopSaidaCategories).toHaveBeenCalledWith(
      { userId: 'user-1', startDate: undefined, endDate: undefined },
      3,
    );
    expect(result.saldoAtual).toBe(0);
    expect(result.periodo).toEqual({ startDate: null, endDate: null });
  });
});
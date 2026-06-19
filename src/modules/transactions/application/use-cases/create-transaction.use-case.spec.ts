import { CategoryRepository } from '../../../categories/domain/ports/category-repository.port';
import { CategoryNotFoundError } from '../../../categories/domain/errors/category-not-found.error';
import { Category } from '../../../categories/domain/entities/category.entity';
import { Transaction } from '../../domain/entities/transaction.entity';
import { TransactionType } from '../../domain/enums/transaction-type.enum';
import { TransactionRepository } from '../../domain/ports/transaction-repository.port';
import { CreateTransactionUseCase } from './create-transaction.use-case';

describe('CreateTransactionUseCase', () => {
  let useCase: CreateTransactionUseCase;
  let repository: jest.Mocked<TransactionRepository>;
  let categoryRepository: jest.Mocked<CategoryRepository>;

  const dto = {
    description: 'Pagamento',
    amount: 100,
    type: TransactionType.SAIDA,
    date: '2026-06-16',
    categoryId: 'cat-1',
  };

  beforeEach(() => {
    repository = {
      findManyByUser: jest.fn(),
      findByIdAndUser: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    };
    categoryRepository = {
      findAllByUser: jest.fn(),
      findAllByUserWithStats: jest.fn(),
      findByIdAndUser: jest.fn(),
      findByNameAndUser: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    };
    useCase = new CreateTransactionUseCase(repository, categoryRepository);
  });

  it('lança CategoryNotFoundError quando a categoria não pertence ao usuário', async () => {
    categoryRepository.findByIdAndUser.mockResolvedValue(null);

    await expect(useCase.execute(dto, 'user-1')).rejects.toBeInstanceOf(
      CategoryNotFoundError,
    );

    expect(categoryRepository.findByIdAndUser).toHaveBeenCalledWith('cat-1', 'user-1');
    expect(repository.create).not.toHaveBeenCalled();
  });

  it('cria a transação quando a categoria pertence ao usuário', async () => {
    categoryRepository.findByIdAndUser.mockResolvedValue({ id: 'cat-1' } as Category);
    repository.create.mockResolvedValue({ id: 'tx-1' } as Transaction);

    const result = await useCase.execute(dto, 'user-1');

    expect(repository.create).toHaveBeenCalledWith({
      description: 'Pagamento',
      amount: 100,
      type: TransactionType.SAIDA,
      date: '2026-06-16',
      categoryId: 'cat-1',
      userId: 'user-1',
    });
    expect(result.id).toBe('tx-1');
  });
});
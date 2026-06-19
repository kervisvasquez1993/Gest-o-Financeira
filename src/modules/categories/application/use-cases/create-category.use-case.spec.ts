import { Category } from '../../domain/entities/category.entity';
import { CategoryNameAlreadyExistsError } from '../../domain/errors/category-name-already-exists.error';
import { CategoryRepository } from '../../domain/ports/category-repository.port';
import { CreateCategoryUseCase } from './create-category.use-case';

describe('CreateCategoryUseCase', () => {
  let useCase: CreateCategoryUseCase;
  let repository: jest.Mocked<CategoryRepository>;

  beforeEach(() => {
    repository = {
      findAllByUser: jest.fn(),
      findAllByUserWithStats: jest.fn(),
      findByIdAndUser: jest.fn(),
      findByNameAndUser: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    };
    useCase = new CreateCategoryUseCase(repository);
  });

  it('lança CategoryNameAlreadyExistsError quando o nome já existe para o usuário', async () => {
    repository.findByNameAndUser.mockResolvedValue({ id: '1' } as Category);

    await expect(
      useCase.execute({ name: 'Fornecedor' }, 'user-1'),
    ).rejects.toBeInstanceOf(CategoryNameAlreadyExistsError);

    expect(repository.create).not.toHaveBeenCalled();
  });

  it('cria a categoria quando o nome é único', async () => {
    repository.findByNameAndUser.mockResolvedValue(null);
    repository.create.mockResolvedValue({ id: 'cat-1', name: 'Fornecedor' } as Category);

    const result = await useCase.execute(
      { name: 'Fornecedor', description: 'desc' },
      'user-1',
    );

    expect(repository.create).toHaveBeenCalledWith({
      name: 'Fornecedor',
      description: 'desc',
      userId: 'user-1',
    });
    expect(result.id).toBe('cat-1');
  });
});
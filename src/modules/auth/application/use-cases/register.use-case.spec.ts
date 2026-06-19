// src/modules/auth/application/use-cases/register.use-case.spec.ts
import { UserRepository } from '../../../users/domain/ports/user-repository.port';
import { User } from '../../../users/domain/entities/user.entity';
import { EmailAlreadyExistsError } from '../../domain/errors/email-already-exists.error';
import { Hasher } from '../../domain/ports/hasher.port';
import { RegisterUseCase } from './register.use-case';

describe('RegisterUseCase', () => {
  let useCase: RegisterUseCase;
  let userRepository: jest.Mocked<UserRepository>;
  let hasher: jest.Mocked<Hasher>;

  beforeEach(() => {
    userRepository = {
      findById: jest.fn(),
      findByEmail: jest.fn(),
      create: jest.fn(),
    };
    hasher = {
      hash: jest.fn(),
      compare: jest.fn(),
    };
    useCase = new RegisterUseCase(userRepository, hasher);
  });

  it('lança EmailAlreadyExistsError quando o e-mail já está cadastrado', async () => {
    userRepository.findByEmail.mockResolvedValue({ id: '1' } as User);

    await expect(
      useCase.execute({ name: 'Kervis', email: 'k@test.com', password: '123456' }),
    ).rejects.toBeInstanceOf(EmailAlreadyExistsError);

    expect(hasher.hash).not.toHaveBeenCalled();
    expect(userRepository.create).not.toHaveBeenCalled();
  });

  it('gera o hash da senha e cria o usuário quando o e-mail é novo', async () => {
    userRepository.findByEmail.mockResolvedValue(null);
    hasher.hash.mockResolvedValue('hashed-pw');
    userRepository.create.mockResolvedValue({
      id: 'uuid-1',
      name: 'Kervis',
      email: 'k@test.com',
    } as User);

    const result = await useCase.execute({
      name: 'Kervis',
      email: 'k@test.com',
      password: '123456',
    });

    expect(hasher.hash).toHaveBeenCalledWith('123456');
    expect(userRepository.create).toHaveBeenCalledWith({
      name: 'Kervis',
      email: 'k@test.com',
      passwordHash: 'hashed-pw',
    });
    expect(result).toEqual({ id: 'uuid-1', name: 'Kervis', email: 'k@test.com' });
  });
});
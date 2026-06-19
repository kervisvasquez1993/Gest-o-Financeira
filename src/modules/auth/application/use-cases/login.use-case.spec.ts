// src/modules/auth/application/use-cases/login.use-case.spec.ts
import { UserRepository } from '../../../users/domain/ports/user-repository.port';
import { User } from '../../../users/domain/entities/user.entity';
import { InvalidCredentialsError } from '../../domain/errors/invalid-credentials.error';
import { Hasher } from '../../domain/ports/hasher.port';
import { TokenProvider } from '../../domain/ports/token-provider.port';
import { LoginUseCase } from './login.use-case';

describe('LoginUseCase', () => {
  let useCase: LoginUseCase;
  let userRepository: jest.Mocked<UserRepository>;
  let hasher: jest.Mocked<Hasher>;
  let tokenProvider: jest.Mocked<TokenProvider>;

  const user = {
    id: 'uuid-1',
    name: 'Kervis',
    email: 'k@test.com',
    passwordHash: 'hashed-pw',
  } as User;

  beforeEach(() => {
    userRepository = {
      findById: jest.fn(),
      findByEmail: jest.fn(),
      create: jest.fn(),
    };
    hasher = { hash: jest.fn(), compare: jest.fn() };
    tokenProvider = { sign: jest.fn() };
    useCase = new LoginUseCase(userRepository, hasher, tokenProvider);
  });

  it('retorna accessToken e user com credenciais válidas', async () => {
    userRepository.findByEmail.mockResolvedValue(user);
    hasher.compare.mockResolvedValue(true);
    tokenProvider.sign.mockResolvedValue('jwt-token');

    const result = await useCase.execute({ email: 'k@test.com', password: '123456' });

    expect(tokenProvider.sign).toHaveBeenCalledWith({ sub: 'uuid-1', email: 'k@test.com' });
    expect(result).toEqual({
      accessToken: 'jwt-token',
      user: { id: 'uuid-1', name: 'Kervis', email: 'k@test.com' },
    });
  });

  it('lança InvalidCredentialsError quando o usuário não existe', async () => {
    userRepository.findByEmail.mockResolvedValue(null);

    await expect(
      useCase.execute({ email: 'no@test.com', password: '123456' }),
    ).rejects.toBeInstanceOf(InvalidCredentialsError);
  });

  it('lança InvalidCredentialsError quando a senha está incorreta', async () => {
    userRepository.findByEmail.mockResolvedValue(user);
    hasher.compare.mockResolvedValue(false);

    await expect(
      useCase.execute({ email: 'k@test.com', password: 'wrong' }),
    ).rejects.toBeInstanceOf(InvalidCredentialsError);

    expect(tokenProvider.sign).not.toHaveBeenCalled();
  });
});
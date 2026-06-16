import { Injectable } from '@nestjs/common';
import { UserRepository } from '../../../users/domain/ports/user-repository.port';
import { InvalidCredentialsError } from '../../domain/errors/invalid-credentials.error';
import { Hasher } from '../../domain/ports/hasher.port';
import { TokenProvider } from '../../domain/ports/token-provider.port';
import { LoginDto } from '../dtos/login.dto';

export interface LoginResult {
  accessToken: string;
  user: { id: string; name: string; email: string };
}

@Injectable()
export class LoginUseCase {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly hasher: Hasher,
    private readonly tokenProvider: TokenProvider,
  ) {}

  async execute(dto: LoginDto): Promise<LoginResult> {
    const user = await this.userRepository.findByEmail(dto.email);
    if (!user) throw new InvalidCredentialsError();

    const valid = await this.hasher.compare(dto.password, user.passwordHash);
    if (!valid) throw new InvalidCredentialsError();

    const accessToken = await this.tokenProvider.sign({ sub: user.id, email: user.email });
    return {
      accessToken,
      user: { id: user.id, name: user.name, email: user.email },
    };
  }
}
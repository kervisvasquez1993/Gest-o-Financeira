import { Injectable } from '@nestjs/common';
import { UserRepository } from '../../../users/domain/ports/user-repository.port';
import { EmailAlreadyExistsError } from '../../domain/errors/email-already-exists.error';
import { Hasher } from '../../domain/ports/hasher.port';
import { RegisterDto } from '../dtos/register.dto';

export interface RegisterResult {
  id: string;
  name: string;
  email: string;
}

@Injectable()
export class RegisterUseCase {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly hasher: Hasher,
  ) {}

  async execute(dto: RegisterDto): Promise<RegisterResult> {
    const existing = await this.userRepository.findByEmail(dto.email);
    if (existing) throw new EmailAlreadyExistsError(dto.email);

    const passwordHash = await this.hasher.hash(dto.password);
    const user = await this.userRepository.create({
      name: dto.name,
      email: dto.email,
      passwordHash,
    });

    return { id: user.id, name: user.name, email: user.email };
  }
}
import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { TokenPayload, TokenProvider } from '../../domain/ports/token-provider.port';

@Injectable()
export class JwtTokenProvider extends TokenProvider {
  constructor(private readonly jwtService: JwtService) {
    super();
  }

  sign(payload: TokenPayload): Promise<string> {
    return this.jwtService.signAsync(payload);
  }
}
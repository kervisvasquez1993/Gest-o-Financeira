export interface TokenPayload {
  sub: string;
  email: string;
}

export abstract class TokenProvider {
  abstract sign(payload: TokenPayload): Promise<string>;
}
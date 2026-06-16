import { UnauthorizedError } from "src/shared/errors/domain-error";

export class InvalidCredentialsError extends UnauthorizedError {
  constructor() {
    super('Credenciales inválidas.');
  }
}
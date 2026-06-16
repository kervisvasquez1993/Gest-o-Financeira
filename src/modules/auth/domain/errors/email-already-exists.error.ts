import { ConflictError } from "src/shared/errors/domain-error";

export class EmailAlreadyExistsError extends ConflictError {
  constructor(email: string) {
    super(`El email ${email} ya está registrado.`);
  }
}
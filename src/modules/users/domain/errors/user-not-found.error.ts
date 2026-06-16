import { NotFoundError } from "src/shared/errors/domain-error";

export class UserNotFoundError extends NotFoundError {
  constructor(id: string) {
    super(`User with ID ${id} not found.`);
  }
}
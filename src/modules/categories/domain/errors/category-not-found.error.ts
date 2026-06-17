import { NotFoundError } from "src/shared/errors/domain-error";

export class CategoryNotFoundError extends NotFoundError {
  constructor(id: string) {
    super(`Category with ID ${id} not found.`);
  }
}
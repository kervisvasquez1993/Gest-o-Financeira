
import { ConflictError } from '../../../../shared/errors/domain-error';

export class CategoryNameAlreadyExistsError extends ConflictError {
  constructor(name: string) {
    super(`Ya existe una categoría con el nombre "${name}".`);
  }
}
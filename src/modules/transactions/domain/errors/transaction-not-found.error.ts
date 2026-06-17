import { NotFoundError } from '../../../../shared/errors/domain-error';

export class TransactionNotFoundError extends NotFoundError {
  constructor(id: string) {
    super(`Transaction with ID ${id} not found.`);
  }
}
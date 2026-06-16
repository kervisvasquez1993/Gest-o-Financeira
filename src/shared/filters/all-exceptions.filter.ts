import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Request, Response } from 'express';
import {
  ConflictError,
  DomainError,
  ForbiddenError,
  NotFoundError,
  UnauthorizedError,
  ValidationError,
} from '../errors/domain-error';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  private readonly logger = new Logger(AllExceptionsFilter.name);

  catch(exception: unknown, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    const { status, message } = this.resolve(exception);

    if (status >= 500) {
      this.logger.error(exception instanceof Error ? exception.stack : String(exception));
    }

    response.status(status).json({
      success: false,
      statusCode: status,
      message,
      path: request.url,
      timestamp: new Date().toISOString(),
    });
  }

  private resolve(exception: unknown): { status: number; message: string | string[] } {
    if (exception instanceof HttpException) {
      const res = exception.getResponse();
      const message =
        typeof res === 'string'
          ? res
          : ((res as { message?: string | string[] }).message ?? exception.message);
      return { status: exception.getStatus(), message };
    }
    if (exception instanceof NotFoundError) return { status: HttpStatus.NOT_FOUND, message: exception.message };
    if (exception instanceof ConflictError) return { status: HttpStatus.CONFLICT, message: exception.message };
    if (exception instanceof UnauthorizedError) return { status: HttpStatus.UNAUTHORIZED, message: exception.message };
    if (exception instanceof ForbiddenError) return { status: HttpStatus.FORBIDDEN, message: exception.message };
    if (exception instanceof ValidationError) return { status: HttpStatus.BAD_REQUEST, message: exception.message };
    if (exception instanceof DomainError) return { status: HttpStatus.BAD_REQUEST, message: exception.message };
    return { status: HttpStatus.INTERNAL_SERVER_ERROR, message: 'Error interno del servidor.' };
  }
}
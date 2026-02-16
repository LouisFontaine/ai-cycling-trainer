import { ExceptionFilter, Catch, ArgumentsHost, HttpStatus } from '@nestjs/common';
import { Response } from 'express';
import {
  DomainException,
  UserNotFoundException,
  InvalidCredentialsException,
  EmailAlreadyExistsException,
  InvalidIntervalsIcuCredentialsException,
} from '@domain/exceptions/domain.exception';

@Catch(DomainException)
export class DomainExceptionFilter implements ExceptionFilter {
  private readonly exceptionToHttpStatus = new Map<
    Function,
    { status: HttpStatus; error: string }
  >([
    [UserNotFoundException, { status: HttpStatus.NOT_FOUND, error: 'Not Found' }],
    [InvalidCredentialsException, { status: HttpStatus.UNAUTHORIZED, error: 'Unauthorized' }],
    [EmailAlreadyExistsException, { status: HttpStatus.CONFLICT, error: 'Conflict' }],
    [
      InvalidIntervalsIcuCredentialsException,
      { status: HttpStatus.UNPROCESSABLE_ENTITY, error: 'Unprocessable Entity' },
    ],
  ]);

  catch(exception: DomainException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    const mapping = this.exceptionToHttpStatus.get(exception.constructor);
    const status = mapping?.status ?? HttpStatus.INTERNAL_SERVER_ERROR;
    const error = mapping?.error ?? 'Internal Server Error';

    response.status(status).json({
      statusCode: status,
      message: exception.message,
      error,
    });
  }
}

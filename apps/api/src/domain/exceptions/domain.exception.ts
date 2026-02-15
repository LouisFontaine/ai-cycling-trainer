export class DomainException extends Error {
  constructor(
    message: string,
    public readonly code: string,
  ) {
    super(message);
    this.name = this.constructor.name;
  }
}

export class UserNotFoundException extends DomainException {
  constructor(message = 'User not found') {
    super(message, 'USER_NOT_FOUND');
  }
}

export class InvalidCredentialsException extends DomainException {
  constructor(message = 'Invalid credentials') {
    super(message, 'INVALID_CREDENTIALS');
  }
}

export class EmailAlreadyExistsException extends DomainException {
  constructor(message = 'Email already registered') {
    super(message, 'EMAIL_ALREADY_EXISTS');
  }
}

export class InvalidIntervalsIcuCredentialsException extends DomainException {
  constructor(
    message = 'Invalid Intervals.icu credentials. Please check your athlete ID and API key.',
  ) {
    super(message, 'INVALID_INTERVALS_ICU_CREDENTIALS');
  }
}

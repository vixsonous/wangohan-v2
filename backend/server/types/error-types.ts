export const ERROR_CLASS_NAMES = {
  IMAGE_SERVICE: 'ImageServiceError',
  DATABASE: 'DatabaseError',
  UNAUTHORIZED: 'UnauthorizedError',
  R2: 'R2Error',
}

export class ImageServiceError extends Error {
  constructor(message: string, cause?: unknown) {
    super(message);
    this.name = ERROR_CLASS_NAMES.IMAGE_SERVICE;
  }
}

export class DatabaseError extends Error {
  constructor(message: string, cause?: unknown) {
    super(message);
    this.name = ERROR_CLASS_NAMES.DATABASE;
  }
}

export class UnauthorizedError extends Error {
  constructor(message: string, cause?: unknown) {
    super(message);
    this.name = ERROR_CLASS_NAMES.UNAUTHORIZED;
  }
}

export class R2Error extends Error {
  constructor(message: string, cause?: unknown) {
    super(message);
    this.name = ERROR_CLASS_NAMES.R2;
  }
}
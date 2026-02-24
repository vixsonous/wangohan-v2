export class ImageServiceError extends Error {
  constructor(message: string, cause?: unknown) {
    super(message);
    this.name = "ImageServiceError";
  }
}

export class DatabaseError extends Error {
  constructor(message: string, cause?: unknown) {
    super(message);
    this.name = "DatabaseError";
  }
}
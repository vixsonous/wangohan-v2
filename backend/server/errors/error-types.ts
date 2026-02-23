export class ImageServiceError extends Error {
  constructor(message: string, cause?: unknown) {
    super(message);
    this.name = "ImageServiceError";
  }
}
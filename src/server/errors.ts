export class PickError extends Error {
  statusCode;
  fieldErrors;
  constructor(message: string, fieldErrors: string[], statusCode = 500) {
    super(message);
    this.statusCode = statusCode;
    this.fieldErrors = fieldErrors;
  }
}

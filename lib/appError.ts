// utils/AppError.ts
export class AppError extends Error {
  public statusCode: number;
  public status: string;
  public isOperational: boolean;
  public errors?: Record<string, string>;

  constructor(
    message: string,
    statusCode: number,
    errors?: Record<string, string>
  ) {
    super(message);

    this.statusCode = statusCode;
    this.status = `${statusCode}`.startsWith("4") ? "fail" : "error";
    this.isOperational = true;
    this.errors = errors;

    // Capture the stack trace
    Error.captureStackTrace(this, this.constructor);
  }
}

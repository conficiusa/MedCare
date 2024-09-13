// utils/errorHandlers.ts
import { AppError } from "@/lib/appError";

export const handleDuplicateFieldsDB = (err: any): AppError => {
  const value = err.message.match(/(["'])(\\?.)*?\1/)[0];
  const message = `Duplicate field value: ${value}. Please use another value!`;
  return new AppError(message, 400);
};

export const handleValidationErrorDB = (err: any): AppError => {
  const errors: Record<string, string> = {};
  Object.keys(err.errors).forEach((field) => {
    errors[field] = err.errors[field].message;
  });
  const message = `Invalid input data. ${Object.values(errors).join("., ")}`;
  return new AppError(message, 400, errors);
};

export const handleCastErrorDB = (err: any): AppError => {
  const message = `Invalid ${err.path}: ${err.value}.`;
  return new AppError(message, 400);
};

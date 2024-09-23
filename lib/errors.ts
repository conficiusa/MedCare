import { NextResponse } from 'next/server';
import { AppError } from './appError';

const sendErrorDev = (err: AppError): NextResponse => {
  return NextResponse.json(
    {
      status: err.status,
      message: err.message,
      error: err,
    },
    { status: err.statusCode }
  );
};

const sendErrorProd = (err: AppError): NextResponse => {
  if (err.isOperational) {
    return NextResponse.json(
      {
        status: err.status,
        message: err.message,
        errors: err.errors,
      },
      { status: err.statusCode }
    );
  } else {
    console.error('ERROR 💥', err);
    return NextResponse.json(
      {
        status: 'error',
        message: "Something went wrong! Don't fret; it's not your fault.",
      },
      { status: 500 }
    );
  }
};

const handleDuplicateFieldsDB = (err: any) => {
  const value = err.message.match(/(["'])(\\?.)*?\1/)[0];
  const message = `Duplicate field value: ${value}. Please use another value!`;
  return new AppError(message, 400);
};

const handleValidationErrorDB = (err: any) => {
  const errors: Record<string, string> = {};
  Object.keys(err.errors).forEach((field) => {
    errors[field] = err.errors[field].message;
  });
  const message = `Invalid input data. ${Object.values(errors).join('., ')}`;
  return new AppError(message, 400, true, errors);
};

const handleCastErrorDB = (err: any) => {
  const message = `Invalid ${err.path}: ${err.value}.`;
  return new AppError(message, 400);
};

// Error Handler Middleware
export const globalErrorHandler = (err: any): NextResponse => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  const environment = process.env.NODE_ENV || 'development';

  if (environment === 'development') {
    return sendErrorDev(err);
  } else if (environment === 'production') {
    let error = { ...err, name: err.name };

    if (error.name === 'CastError') error = handleCastErrorDB(error);
    if (error.code === 11000) error = handleDuplicateFieldsDB(error);
    if (error.name === 'ValidationError') error = handleValidationErrorDB(error);
    if (error.name === 'JsonWebTokenError')
      error = new AppError('Invalid token. Please log in again!', 401);
    if (error.name === 'TokenExpiredError')
      error = new AppError('Your token has expired! Please log in again.', 401);

    return sendErrorProd(error);
  }

  // Default return statement to handle unexpected cases
  return NextResponse.json(
    {
      status: 'error',
      message: 'An unexpected error occurred.',
    },
    { status: 500 }
  );
};

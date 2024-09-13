// utils/errorHandler.ts
import { NextResponse } from "next/server";
import { AppError } from "@/lib/appError";
import {
  handleDuplicateFieldsDB,
  handleValidationErrorDB,
  handleCastErrorDB,
} from "@/lib/errors";

// Function to handle errors in development
const sendErrorDev = (err: AppError) => {
  return NextResponse.json(
    {
      status: err.status,
      message: err.message,
      error: err,
    },
    { status: err.statusCode }
  );
};

// Function to handle errors in production
const sendErrorProd = (err: AppError) => {
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
    console.error("ERROR 💥", err);
    return NextResponse.json(
      {
        status: "error",
        message: "Something went wrong! Please try again later.",
      },
      { status: 500 }
    );
  }
};

// Central error handling middleware
export const errorHandler = (err: any) => {
  const environment = process.env.NODE_ENV || "development";
  let error = { ...err, name: err.name };

  if (environment === "development") {
    return sendErrorDev(error as AppError);
  } else {
    if (error.name === "CastError") error = handleCastErrorDB(error);
    if (error.code === 11000) error = handleDuplicateFieldsDB(error);
    if (error.name === "ValidationError")
      error = handleValidationErrorDB(error);
    if (error.name === "JsonWebTokenError")
      error = new AppError("Invalid token. Please log in again!", 401);
    if (error.name === "TokenExpiredError")
      error = new AppError("Your token has expired! Please log in again.", 401);

    return sendErrorProd(error as AppError);
  }
};

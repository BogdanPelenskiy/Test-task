import { Request, Response, NextFunction } from "express";
import { ZodError } from "zod";

type ApiErrorLike = {
  statusCode?: number;
  code?: string;
  message?: string;
  details?: unknown;
};

export function errorMiddleware(
  err: unknown,
  req: Request,
  res: Response,
  next: NextFunction
) {
  if (err instanceof ZodError) {
    return res.status(400).json({
      error: {
        code: "VALIDATION_ERROR",
        message: "Invalid request",
        details: err.issues,
      },
    });
  }

  const e = err as ApiErrorLike;

  if (e && typeof e.statusCode === "number") {
    return res.status(e.statusCode).json({
      error: {
        code: e.code ?? "ERROR",
        message: e.message ?? "Request failed",
        details: e.details,
      },
    });
  }

  console.error(err);

  return res.status(500).json({
    error: {
      code: "INTERNAL_ERROR",
      message: "Something went wrong",
    },
  });
}

import { Request, Response, NextFunction } from 'express';
import { validationResult, ValidationError } from 'express-validator';

/**
 * Validation Error Handler
 * Processes validation errors from express-validator
 */

interface FormattedError {
  field: string;
  message: string;
  value?: any;
}

/**
 * Middleware to handle validation errors
 * Should be used after validation chains
 */
export const handleValidationErrors = (
  req: Request,
  res: Response,
  next: NextFunction
): void | Response => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    const formattedErrors: FormattedError[] = errors.array().map((error: ValidationError) => {
      // Type guard for FieldValidationError
      if (error.type === 'field') {
        return {
          field: error.path,
          message: error.msg,
          value: error.value,
        };
      }
      // Fallback for other error types
      return {
        field: 'unknown',
        message: error.msg,
      };
    });

    return res.status(400).json({
      error: 'Validation failed',
      message: 'Please check your input and try again',
      errors: formattedErrors,
      code: 'VALIDATION_ERROR',
    });
  }

  next();
};

/**
 * Format a single validation error
 */
export const formatValidationError = (error: ValidationError): FormattedError => {
  if (error.type === 'field') {
    return {
      field: error.path,
      message: error.msg,
      value: error.value,
    };
  }
  return {
    field: 'unknown',
    message: error.msg,
  };
};

/**
 * Custom validation error response
 */
export const validationErrorResponse = (errors: FormattedError[]): {
  error: string;
  message: string;
  errors: FormattedError[];
  code: string;
} => {
  return {
    error: 'Validation failed',
    message: 'Please check your input and try again',
    errors,
    code: 'VALIDATION_ERROR',
  };
};

/**
 * Check if request has validation errors
 */
export const hasValidationErrors = (req: Request): boolean => {
  const errors = validationResult(req);
  return !errors.isEmpty();
};

/**
 * Get validation errors from request
 */
export const getValidationErrors = (req: Request): FormattedError[] => {
  const errors = validationResult(req);
  return errors.array().map(formatValidationError);
};

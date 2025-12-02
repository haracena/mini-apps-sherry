/**
 * Custom error classes for type-safe error handling
 * Provides structured error information for different error scenarios
 */

export enum ErrorCode {
  // Validation errors
  VALIDATION_ERROR = 'VALIDATION_ERROR',
  INVALID_EMAIL = 'INVALID_EMAIL',
  INVALID_UUID = 'INVALID_UUID',
  INVALID_INPUT = 'INVALID_INPUT',

  // Authentication errors
  UNAUTHORIZED = 'UNAUTHORIZED',
  FORBIDDEN = 'FORBIDDEN',
  SESSION_EXPIRED = 'SESSION_EXPIRED',

  // Database errors
  DATABASE_ERROR = 'DATABASE_ERROR',
  NOT_FOUND = 'NOT_FOUND',
  DUPLICATE_ENTRY = 'DUPLICATE_ENTRY',

  // Network errors
  NETWORK_ERROR = 'NETWORK_ERROR',
  TIMEOUT = 'TIMEOUT',
  RATE_LIMITED = 'RATE_LIMITED',

  // Web3 errors
  WALLET_NOT_CONNECTED = 'WALLET_NOT_CONNECTED',
  WRONG_NETWORK = 'WRONG_NETWORK',
  INSUFFICIENT_FUNDS = 'INSUFFICIENT_FUNDS',
  TRANSACTION_FAILED = 'TRANSACTION_FAILED',
  CONTRACT_ERROR = 'CONTRACT_ERROR',

  // API errors
  API_ERROR = 'API_ERROR',
  INVALID_REQUEST = 'INVALID_REQUEST',
  SERVER_ERROR = 'SERVER_ERROR',

  // Telegram errors
  TELEGRAM_AUTH_FAILED = 'TELEGRAM_AUTH_FAILED',
  TELEGRAM_GROUP_NOT_FOUND = 'TELEGRAM_GROUP_NOT_FOUND',
  TELEGRAM_BOT_ERROR = 'TELEGRAM_BOT_ERROR',

  // Unknown errors
  UNKNOWN_ERROR = 'UNKNOWN_ERROR',
}

/**
 * Base application error class
 */
export class AppError extends Error {
  public readonly code: ErrorCode;
  public readonly statusCode: number;
  public readonly isOperational: boolean;
  public readonly context?: Record<string, unknown>;

  constructor(
    message: string,
    code: ErrorCode = ErrorCode.UNKNOWN_ERROR,
    statusCode: number = 500,
    isOperational: boolean = true,
    context?: Record<string, unknown>
  ) {
    super(message);
    this.name = this.constructor.name;
    this.code = code;
    this.statusCode = statusCode;
    this.isOperational = isOperational;
    this.context = context;

    Error.captureStackTrace(this, this.constructor);
  }
}

/**
 * Validation error
 */
export class ValidationError extends AppError {
  constructor(message: string, context?: Record<string, unknown>) {
    super(message, ErrorCode.VALIDATION_ERROR, 400, true, context);
  }
}

/**
 * Authentication error
 */
export class AuthenticationError extends AppError {
  constructor(message: string, context?: Record<string, unknown>) {
    super(message, ErrorCode.UNAUTHORIZED, 401, true, context);
  }
}

/**
 * Authorization error
 */
export class AuthorizationError extends AppError {
  constructor(message: string, context?: Record<string, unknown>) {
    super(message, ErrorCode.FORBIDDEN, 403, true, context);
  }
}

/**
 * Not found error
 */
export class NotFoundError extends AppError {
  constructor(message: string, context?: Record<string, unknown>) {
    super(message, ErrorCode.NOT_FOUND, 404, true, context);
  }
}

/**
 * Database error
 */
export class DatabaseError extends AppError {
  constructor(message: string, context?: Record<string, unknown>) {
    super(message, ErrorCode.DATABASE_ERROR, 500, true, context);
  }
}

/**
 * Network error
 */
export class NetworkError extends AppError {
  constructor(message: string, context?: Record<string, unknown>) {
    super(message, ErrorCode.NETWORK_ERROR, 503, true, context);
  }
}

/**
 * Web3 wallet error
 */
export class WalletError extends AppError {
  constructor(
    message: string,
    code: ErrorCode = ErrorCode.WALLET_NOT_CONNECTED,
    context?: Record<string, unknown>
  ) {
    super(message, code, 400, true, context);
  }
}

/**
 * Smart contract error
 */
export class ContractError extends AppError {
  constructor(message: string, context?: Record<string, unknown>) {
    super(message, ErrorCode.CONTRACT_ERROR, 400, true, context);
  }
}

/**
 * Telegram error
 */
export class TelegramError extends AppError {
  constructor(
    message: string,
    code: ErrorCode = ErrorCode.TELEGRAM_BOT_ERROR,
    context?: Record<string, unknown>
  ) {
    super(message, code, 400, true, context);
  }
}

/**
 * API error
 */
export class ApiError extends AppError {
  constructor(
    message: string,
    statusCode: number = 500,
    context?: Record<string, unknown>
  ) {
    super(message, ErrorCode.API_ERROR, statusCode, true, context);
  }
}

/**
 * Check if an error is an AppError
 */
export function isAppError(error: unknown): error is AppError {
  return error instanceof AppError;
}

/**
 * Extract error message from any error type
 */
export function getErrorMessage(error: unknown): string {
  if (isAppError(error)) {
    return error.message;
  }

  if (error instanceof Error) {
    return error.message;
  }

  if (typeof error === 'string') {
    return error;
  }

  return 'An unexpected error occurred';
}

/**
 * Convert unknown error to AppError
 */
export function toAppError(error: unknown): AppError {
  if (isAppError(error)) {
    return error;
  }

  if (error instanceof Error) {
    return new AppError(
      error.message,
      ErrorCode.UNKNOWN_ERROR,
      500,
      false,
      { originalError: error.name }
    );
  }

  return new AppError(
    'An unexpected error occurred',
    ErrorCode.UNKNOWN_ERROR,
    500,
    false
  );
}

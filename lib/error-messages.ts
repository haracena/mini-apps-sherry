export const ERROR_MESSAGES = {
  NETWORK: {
    TIMEOUT: "Request timed out. Please check your connection and try again.",
    OFFLINE: "You appear to be offline. Please check your internet connection.",
    FAILED: "Network request failed. Please try again.",
  },
  WALLET: {
    NOT_CONNECTED: "Please connect your wallet to continue.",
    WRONG_NETWORK: "Please switch to Avalanche network.",
    REJECTED: "Transaction was rejected.",
    INSUFFICIENT_FUNDS: "Insufficient funds to complete this transaction.",
    USER_REJECTED: "You rejected the transaction request.",
  },
  VALIDATION: {
    REQUIRED_FIELD: "This field is required.",
    INVALID_EMAIL: "Please enter a valid email address.",
    INVALID_ADDRESS: "Please enter a valid wallet address.",
    INVALID_PRICE: "Please enter a valid price.",
    PRICE_TOO_LOW: "Price is too low.",
    PRICE_TOO_HIGH: "Price exceeds maximum allowed.",
  },
  AUTH: {
    NOT_AUTHENTICATED: "Please sign in to continue.",
    SESSION_EXPIRED: "Your session has expired. Please sign in again.",
    UNAUTHORIZED: "You don't have permission to perform this action.",
  },
  API: {
    SERVER_ERROR: "Something went wrong. Please try again later.",
    NOT_FOUND: "The requested resource was not found.",
    BAD_REQUEST: "Invalid request. Please check your input.",
    RATE_LIMITED: "Too many requests. Please wait a moment and try again.",
  },
  TELEGRAM: {
    BOT_NOT_FOUND: "Could not connect to Telegram bot.",
    GROUP_NOT_FOUND: "Telegram group not found.",
    NOT_ADMIN: "Bot must be an admin in the group.",
    ALREADY_LINKED: "This group is already linked.",
  },
  GENERAL: {
    UNKNOWN: "An unexpected error occurred. Please try again.",
    TRY_AGAIN: "Something went wrong. Please try again.",
  },
} as const;

export function getErrorMessage(
  error: unknown,
  fallback: string = ERROR_MESSAGES.GENERAL.UNKNOWN
): string {
  if (typeof error === "string") return error;

  if (error instanceof Error) return error.message;

  if (typeof error === "object" && error !== null && "message" in error) {
    return String(error.message);
  }

  return fallback;
}

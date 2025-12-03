/**
 * Validates email format using a more robust regex pattern
 * @param email - Email address to validate
 * @returns true if email format is valid
 */
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;

  if (!emailRegex.test(email)) {
    return false;
  }

  // Additional validation checks
  const [localPart, domain] = email.split('@');

  // Local part should not be empty
  if (!localPart || !domain) {
    return false;
  }

  // Local part should not exceed 64 characters
  if (localPart.length > 64) {
    return false;
  }

  // Domain should not exceed 253 characters
  if (domain.length > 253) {
    return false;
  }

  return true;
}

/**
 * Checks if email domain is from a known disposable email provider
 * @param email - Email address to check
 * @returns true if email is from a disposable provider
 */
export function isDisposableEmail(email: string): boolean {
  const disposableDomains = [
    "tempmail.com",
    "throwaway.email",
    "guerrillamail.com",
    "10minutemail.com",
    "mailinator.com",
    "trashmail.com",
    "yopmail.com",
    "temp-mail.org",
    "fakeinbox.com",
    "getnada.com",
    "emailondeck.com",
    "maildrop.cc",
    "sharklasers.com",
    "getairmail.com",
    "mintemail.com",
    "disposablemail.com",
  ];

  const domain = email.split("@")[1]?.toLowerCase();
  return domain ? disposableDomains.includes(domain) : false;
}

/**
 * Validates UUID v4 format
 * @param uuid - UUID string to validate
 * @returns true if UUID is valid v4 format
 */
export function isValidUUID(uuid: string): boolean {
  const uuidRegex =
    /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  return uuidRegex.test(uuid);
}

/**
 * Sanitizes input by trimming whitespace and removing potentially harmful characters
 * @param input - String to sanitize
 * @returns Sanitized string
 */
export function sanitizeInput(input: string): string {
  return input.trim().replace(/[<>]/g, "");
}

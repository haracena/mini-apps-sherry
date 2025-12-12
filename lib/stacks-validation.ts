/**
 * Stacks input validation utilities
 */

/**
 * Validate Stacks address format
 */
export function isValidStacksAddress(address: string): boolean {
  // Stacks addresses start with SP (mainnet) or ST (testnet)
  // Followed by 38-41 alphanumeric characters
  const regex = /^(SP|ST)[0-9A-Z]{38,41}$/;
  return regex.test(address);
}

/**
 * Validate contract identifier format
 */
export function isValidContractId(contractId: string): boolean {
  // Format: <address>.<contract-name>
  const parts = contractId.split(".");
  if (parts.length !== 2) return false;

  const [address, contractName] = parts;
  return isValidStacksAddress(address) && isValidContractName(contractName);
}

/**
 * Validate contract name
 */
export function isValidContractName(name: string): boolean {
  // Contract names must be alphanumeric, hyphens, underscores
  // Max length 40 characters
  const regex = /^[a-zA-Z][a-zA-Z0-9_-]{0,39}$/;
  return regex.test(name);
}

/**
 * Validate transaction ID format
 */
export function isValidTxId(txId: string): boolean {
  // Transaction IDs are 64-character hex strings with 0x prefix
  const regex = /^0x[a-fA-F0-9]{64}$/;
  return regex.test(txId);
}

/**
 * Validate STX amount
 */
export function isValidStxAmount(amount: string | number): boolean {
  const num = typeof amount === "string" ? parseFloat(amount) : amount;

  if (isNaN(num)) return false;
  if (num < 0) return false;
  if (num === 0) return true;

  // Check maximum decimal places (6 for STX)
  const parts = num.toString().split(".");
  if (parts.length > 1 && parts[1].length > 6) return false;

  return true;
}

/**
 * Validate micro STX amount (integer)
 */
export function isValidMicroStx(amount: string | number): boolean {
  const num = typeof amount === "string" ? parseInt(amount) : amount;

  if (isNaN(num)) return false;
  if (num < 0) return false;
  if (!Number.isInteger(num)) return false;

  return true;
}

/**
 * Validate block height
 */
export function isValidBlockHeight(height: string | number): boolean {
  const num = typeof height === "string" ? parseInt(height) : height;

  if (isNaN(num)) return false;
  if (num < 0) return false;
  if (!Number.isInteger(num)) return false;

  return true;
}

/**
 * Validate nonce
 */
export function isValidNonce(nonce: string | number): boolean {
  const num = typeof nonce === "string" ? parseInt(nonce) : nonce;

  if (isNaN(num)) return false;
  if (num < 0) return false;
  if (!Number.isInteger(num)) return false;

  return true;
}

/**
 * Sanitize address (uppercase and trim)
 */
export function sanitizeAddress(address: string): string {
  return address.trim().toUpperCase();
}

/**
 * Sanitize contract name (lowercase and trim)
 */
export function sanitizeContractName(name: string): string {
  return name.trim().toLowerCase();
}

/**
 * Validate and sanitize contract ID
 */
export function sanitizeContractId(contractId: string): string {
  const parts = contractId.split(".");
  if (parts.length !== 2) return contractId;

  const [address, contractName] = parts;
  return `${sanitizeAddress(address)}.${sanitizeContractName(contractName)}`;
}

/**
 * Validate memo field (max 34 bytes)
 */
export function isValidMemo(memo: string): boolean {
  const encoder = new TextEncoder();
  const encoded = encoder.encode(memo);
  return encoded.length <= 34;
}

/**
 * Validate function name
 */
export function isValidFunctionName(name: string): boolean {
  // Function names follow similar rules to contract names
  const regex = /^[a-zA-Z][a-zA-Z0-9_-]{0,127}$/;
  return regex.test(name);
}

/**
 * Comprehensive validation result
 */
export interface ValidationResult {
  isValid: boolean;
  errors: string[];
}

/**
 * Validate transaction data
 */
export function validateTransaction(data: {
  recipient?: string;
  amount?: string | number;
  memo?: string;
  nonce?: string | number;
}): ValidationResult {
  const errors: string[] = [];

  if (data.recipient && !isValidStacksAddress(data.recipient)) {
    errors.push("Invalid recipient address");
  }

  if (data.amount !== undefined && !isValidStxAmount(data.amount)) {
    errors.push("Invalid STX amount");
  }

  if (data.memo && !isValidMemo(data.memo)) {
    errors.push("Memo exceeds maximum length (34 bytes)");
  }

  if (data.nonce !== undefined && !isValidNonce(data.nonce)) {
    errors.push("Invalid nonce value");
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}

/**
 * Validate contract call data
 */
export function validateContractCall(data: {
  contractAddress: string;
  contractName: string;
  functionName: string;
  functionArgs?: any[];
}): ValidationResult {
  const errors: string[] = [];

  if (!isValidStacksAddress(data.contractAddress)) {
    errors.push("Invalid contract address");
  }

  if (!isValidContractName(data.contractName)) {
    errors.push("Invalid contract name");
  }

  if (!isValidFunctionName(data.functionName)) {
    errors.push("Invalid function name");
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}

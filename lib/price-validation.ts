import { VALIDATION_LIMITS, PLATFORM_FEE_PERCENTAGE } from "./constants";

export interface PriceBreakdown {
  price: number;
  referralCommission: number;
  referralAmount: number;
  platformFee: number;
  ownerReceives: number;
}

export function calculatePriceBreakdown(
  price: number,
  referralCommissionPercent: number = 0
): PriceBreakdown {
  const referralAmount = (price * referralCommissionPercent) / 100;
  const platformFee = (price * PLATFORM_FEE_PERCENTAGE) / 100;
  const ownerReceives = price - referralAmount - platformFee;

  return {
    price,
    referralCommission: referralCommissionPercent,
    referralAmount,
    platformFee,
    ownerReceives,
  };
}

export function validatePrice(price: number): {
  valid: boolean;
  error?: string;
  warning?: string;
} {
  if (price < VALIDATION_LIMITS.PRICE_MIN) {
    return {
      valid: false,
      error: "Price must be 0 or greater",
    };
  }

  if (price > VALIDATION_LIMITS.PRICE_MAX) {
    return {
      valid: false,
      error: `Price cannot exceed ${VALIDATION_LIMITS.PRICE_MAX} AVAX`,
    };
  }

  if (price > 0 && price < 0.001) {
    return {
      valid: true,
      warning: "Very low price may not cover gas fees",
    };
  }

  if (price > 10) {
    return {
      valid: true,
      warning: "High price - please confirm this is intentional",
    };
  }

  return { valid: true };
}

export function validateCommission(
  commission: number,
  price: number
): {
  valid: boolean;
  error?: string;
  warning?: string;
} {
  if (commission < VALIDATION_LIMITS.COMMISSION_MIN) {
    return {
      valid: false,
      error: "Commission must be 0 or greater",
    };
  }

  if (commission > VALIDATION_LIMITS.COMMISSION_MAX) {
    return {
      valid: false,
      error: "Commission cannot exceed 100%",
    };
  }

  if (commission > 50) {
    return {
      valid: true,
      warning: "High commission may reduce your earnings significantly",
    };
  }

  const breakdown = calculatePriceBreakdown(price, commission);
  if (breakdown.ownerReceives < 0) {
    return {
      valid: false,
      error: "Commission and platform fee exceed the price",
    };
  }

  return { valid: true };
}

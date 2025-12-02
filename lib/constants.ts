export const APP_NAME = "Social Triggers";
export const APP_DESCRIPTION =
  "Create and manage private Telegram group invitations with blockchain security";

export const PLATFORM_FEE_PERCENTAGE = 10;

export const VALIDATION_LIMITS = {
  TITLE_MIN: 1,
  TITLE_MAX: 50,
  DESCRIPTION_MIN: 1,
  DESCRIPTION_MAX: 150,
  PRICE_MIN: 0,
  PRICE_MAX: 100,
  COMMISSION_MIN: 0,
  COMMISSION_MAX: 100,
} as const;

export const STATUS = {
  PENDING: "PENDING",
  COMPLETED: "COMPLETED",
  FAILED: "FAILED",
} as const;

export const STATUS_COLORS = {
  PENDING: "warning",
  COMPLETED: "success",
  FAILED: "error",
} as const;

export const ROUTES = {
  HOME: "/",
  DASHBOARD: "/dashboard",
  TELEGRAM_BOT: "https://t.me/MiniAppsBlockchainBot?startgroup=start",
} as const;

export const EXTERNAL_LINKS = {
  GITHUB: "https://github.com/haracena/mini-apps-sherry",
  DOCS: "#",
  SUPPORT: "#",
} as const;

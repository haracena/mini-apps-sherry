// Stepper types
export interface StepperMethods {
  next: () => void;
  prev: () => void;
  goTo: (stepId: string) => void;
  when: (stepId: string, callback: (step: Step) => JSX.Element) => JSX.Element | null;
}

export interface Step {
  id: string;
  title: string;
  isActive: boolean;
  isCompleted: boolean;
}

// Telegram types
export interface TelegramUser {
  id: number;
  first_name: string;
  last_name?: string;
  username?: string;
  photo_url?: string;
  auth_date: number;
  hash: string;
}

// Database types
export interface TelegramInvitationConfig {
  group_id: string;
  title: string;
  description: string;
  telegram_group_id: string;
  telegram_group_name: string;
  telegram_user_id: string;
  owner_address: string;
  invitation_price: number;
  referralCommission: number;
  created_at: string;
  updated_at?: string;
}

export interface TelegramInvitation {
  id: string;
  group_id: string;
  group_id_hash: string;
  email: string;
  payer_address: string;
  referral?: string;
  status: 'PENDING' | 'COMPLETED' | 'FAILED';
  telegram_invitation_url?: string;
  created_at: string;
  updated_at?: string;
}

export interface Transaction {
  id: string;
  group_id: string;
  payer_address: string;
  amount: number;
  transaction_hash: string;
  block_number: number;
  status: 'PENDING' | 'CONFIRMED' | 'FAILED';
  created_at: string;
}

// Daily Streak types
export interface PlayerData {
  totalPoints: bigint;
  currentStreak: bigint;
  lastSpinDay: bigint;
  lastSpinTimestamp: bigint;
}

export interface WheelPrize {
  id: number;
  minPoints: number;
  maxPoints: number;
  probability: number;
  color: string;
  label: string;
}

export interface SpinResult {
  points: number;
  newTotalPoints: number;
  currentStreak: number;
  transactionHash: string;
}

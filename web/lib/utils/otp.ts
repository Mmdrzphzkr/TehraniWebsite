import crypto from 'crypto';

/**
 * Generate a random 6-digit OTP
 */
export function generateOtp(): string {
  return crypto.randomInt(100000, 999999).toString();
}

/**
 * Check if OTP has expired
 * @param createdAt - Timestamp when OTP was created
 * @param expirySeconds - OTP validity duration in seconds (default: 120)
 */
export function isOtpExpired(createdAt: Date, expirySeconds: number = 120): boolean {
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - createdAt.getTime()) / 1000);
  return diffInSeconds > expirySeconds;
}

/**
 * Check if resend is allowed (cooldown period)
 * @param lastSentAt - Timestamp when OTP was last sent
 * @param cooldownSeconds - Cooldown period in seconds (default: 60)
 */
export function canResendOtp(lastSentAt: Date | null, cooldownSeconds: number = 60): {
  allowed: boolean;
  secondsRemaining?: number;
} {
  if (!lastSentAt) {
    return { allowed: true };
  }

  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - lastSentAt.getTime()) / 1000);
  const remaining = cooldownSeconds - diffInSeconds;

  if (remaining <= 0) {
    return { allowed: true };
  }

  return { allowed: false, secondsRemaining: remaining };
}

/**
 * Validate phone number format (Iranian mobile numbers)
 * Accepts: 09xxxxxxxxx or +989xxxxxxxxx
 */
export function validatePhoneNumber(phone: string): { valid: boolean; error?: string } {
  const cleaned = phone.replace(/\D/g, '');

  // Accept 09xxxxxxxxx (11 digits) or 989xxxxxxxxx (12 digits)
  if (!/^(0|98)9\d{9}$/.test(cleaned)) {
    return { valid: false, error: 'شماره تلفن نامعتبر است' };
  }

  return { valid: true };
}

/**
 * Normalize phone number to 0-prefix format
 */
export function normalizePhoneNumber(phone: string): string {
  let normalized = phone.replace(/\D/g, '');

  // Remove country code if present (98 to 0)
  if (normalized.startsWith('98')) {
    normalized = '0' + normalized.slice(2);
  }

  return normalized;
}

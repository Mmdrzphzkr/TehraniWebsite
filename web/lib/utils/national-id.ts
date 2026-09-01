/**
 * Validate Iranian National ID (کد ملی)
 * Implements the official checksum algorithm
 */

/**
 * Validate format and checksum of Iranian national ID
 * Returns { valid: boolean, error?: string }
 */
export function validateNationalId(nationalId: string): { valid: boolean; error?: string } {
  // Remove whitespace
  const cleaned = nationalId.replace(/\s/g, '');

  // Must be exactly 10 digits
  if (!/^\d{10}$/.test(cleaned)) {
    return { valid: false, error: 'کد ملی باید 10 رقم باشد' };
  }

  // Cannot be all same digits (e.g., 0000000000)
  if (/^(\d)\1{9}$/.test(cleaned)) {
    return { valid: false, error: 'کد ملی نامعتبر است' };
  }

  // Check digit validation
  let check = 0;
  for (let i = 0; i < 9; i++) {
    check += parseInt(cleaned[i], 10) * (10 - i);
  }

  const remainder = check % 11;
  const checkDigit = parseInt(cleaned[9], 10);

  // If remainder is less than 2, checksum equals remainder
  // Otherwise, checksum equals 11 - remainder
  const expectedChecksum = remainder < 2 ? remainder : 11 - remainder;

  if (checkDigit !== expectedChecksum) {
    return { valid: false, error: 'کد ملی معتبر نیست' };
  }

  return { valid: true };
}

/**
 * Format national ID for storage (remove whitespace, validate)
 */
export function formatNationalId(nationalId: string): string | null {
  const validation = validateNationalId(nationalId);
  if (!validation.valid) {
    return null;
  }
  return nationalId.replace(/\s/g, '');
}

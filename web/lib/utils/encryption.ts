import crypto from 'crypto';

const ENCRYPTION_ALGORITHM = 'aes-256-cbc';
const ENCRYPTION_KEY = process.env.ENCRYPTION_KEY || '';
const ENCRYPTION_IV = process.env.ENCRYPTION_IV || '';

/**
 * Encrypt sensitive data (phone numbers, national IDs)
 */
export function encryptData(data: string): string {
  if (!ENCRYPTION_KEY || !ENCRYPTION_IV) {
    throw new Error('Encryption keys not configured');
  }

  const key = Buffer.from(ENCRYPTION_KEY, 'hex');
  const iv = Buffer.from(ENCRYPTION_IV, 'hex');

  const cipher = crypto.createCipheriv(ENCRYPTION_ALGORITHM, key, iv);
  let encrypted = cipher.update(data, 'utf8', 'hex');
  encrypted += cipher.final('hex');

  return encrypted;
}

/**
 * Decrypt sensitive data
 */
export function decryptData(encryptedData: string): string {
  if (!ENCRYPTION_KEY || !ENCRYPTION_IV) {
    throw new Error('Encryption keys not configured');
  }

  const key = Buffer.from(ENCRYPTION_KEY, 'hex');
  const iv = Buffer.from(ENCRYPTION_IV, 'hex');

  const decipher = crypto.createDecipheriv(ENCRYPTION_ALGORITHM, key, iv);
  let decrypted = decipher.update(encryptedData, 'hex', 'utf8');
  decrypted += decipher.final('utf8');

  return decrypted;
}

/**
 * Hash data for uniqueness validation (national ID)
 */
export function hashData(data: string): string {
  return crypto.createHash('sha256').update(data).digest('hex');
}

import {
  generateOtp,
  canResendOtp,
  validatePhoneNumber,
  normalizePhoneNumber,
} from '@/lib/utils/otp';
import { generateToken } from '@/lib/utils/jwt';

const STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_URL || 'http://localhost:1337';
const STRAPI_TOKEN = process.env.STRAPI_API_TOKEN || '';
const OTP_EXPIRY_SECONDS = parseInt(process.env.OTP_EXPIRY_SECONDS || '120', 10);
const OTP_RESEND_COOLDOWN = parseInt(process.env.OTP_RESEND_COOLDOWN || '60', 10);
const OTP_MAX_ATTEMPTS = parseInt(process.env.OTP_MAX_ATTEMPTS || '3', 10);

export interface SendOtpResponse {
  success: boolean;
  message: string;
  otpId?: number;
  error?: string;
}

export interface VerifyOtpResponse {
  success: boolean;
  message: string;
  userId?: string;
  token?: string;
  error?: string;
}

/**
 * Request OTP for phone number
 */
export async function requestOtp(phoneNumber: string): Promise<SendOtpResponse> {
  try {
    const validation = validatePhoneNumber(phoneNumber);
    if (!validation.valid) {
      return { success: false, message: validation.error || 'شماره تلفن نامعتبر است' };
    }

    const normalizedPhone = normalizePhoneNumber(phoneNumber);
    console.log(`[OTP] Requesting OTP for: ${normalizedPhone}`);
    console.log(`[OTP] Strapi URL: ${STRAPI_URL}`);
    console.log(`[OTP] Token present: ${STRAPI_TOKEN ? 'yes' : 'no'}`);

    // Check for existing OTP
    const fetchUrl = `${STRAPI_URL}/api/otp-logs?filters[mobile][$eq]=${normalizedPhone}&sort=createdAt:desc&pagination[limit]=1&fields=*`;
    console.log(`[OTP] Fetching from: ${fetchUrl}`);

    const fetchHeaders: Record<string, string> = {};
    if (STRAPI_TOKEN) {
      const bearer = 'Bearer ' + STRAPI_TOKEN;
      fetchHeaders['Authorization'] = bearer;
    }
    console.log(`[OTP] Headers: ${JSON.stringify(Object.keys(fetchHeaders))}`);

    const existingOtpResponse = await fetch(fetchUrl, {
      headers: fetchHeaders,
    });

    console.log(`[OTP] Fetch response status: ${existingOtpResponse.status}`);

    if (!existingOtpResponse.ok) {
      const errorText = await existingOtpResponse.text();
      console.error(`[OTP] Fetch failed: ${existingOtpResponse.status} - ${errorText}`);
      throw new Error(`Failed to fetch OTP: ${existingOtpResponse.status}`);
    }

    const existingOtpData = await existingOtpResponse.json();
    const existingOtp = existingOtpData.data?.[0];

    if (existingOtp) {
      const expiresAt = new Date(existingOtp.expiresAt);
      if (new Date() < expiresAt) {
        const resendCheck = canResendOtp(new Date(existingOtp.createdAt), OTP_RESEND_COOLDOWN);
        if (!resendCheck.allowed) {
          return {
            success: false,
            message: `لطفا ${resendCheck.secondsRemaining} ثانیه بعد تلاش کنید`,
          };
        }
        console.log(`[OTP] Reusing existing OTP: ${existingOtp.id}`);
        return {
          success: true,
          message: 'کد تأیید برای شما ارسال شد',
          otpId: existingOtp.id,
        };
      }
    }

    // Generate new OTP
    const newOtp = generateOtp();
    const expiresAt = new Date(Date.now() + OTP_EXPIRY_SECONDS * 1000);
    console.log(`[OTP] Creating new OTP: ${newOtp}`);

    const createOtpResponse = await fetch(`${STRAPI_URL}/api/otp-logs`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(STRAPI_TOKEN ? { Authorization: 'Bearer ' + STRAPI_TOKEN } : {}),
      },
      body: JSON.stringify({
        data: {
          mobile: normalizedPhone,
          otp: newOtp,
          expiresAt: expiresAt.toISOString(),
          attempts: 0,
        },
      }),
    });

    console.log(`[OTP] Create response status: ${createOtpResponse.status}`);

    if (!createOtpResponse.ok) {
      const errorText = await createOtpResponse.text();
      console.error(`[OTP] Create failed: ${createOtpResponse.status} - ${errorText}`);
      throw new Error(`Failed to create OTP: ${createOtpResponse.status}`);
    }

    const createdOtpData = await createOtpResponse.json();
    console.log(`[OTP] Created OTP record: ${createdOtpData.data.id}`);

    // Send SMS asynchronously
    // sendOtpSms(normalizedPhone, newOtp).catch(console.error);

    return {
      success: true,
      message: 'کد تأیید برای شما ارسال شد',
      otpId: createdOtpData.data.id,
    };
  } catch (error) {
    console.error('Error requesting OTP:', error);
    return {
      success: false,
      message: 'خطا در ارسال کد تأیید',
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

/**
 * Verify OTP and return user token
 */
export async function verifyOtp(phoneNumber: string, otpCode: string): Promise<VerifyOtpResponse> {
  try {
    const validation = validatePhoneNumber(phoneNumber);
    if (!validation.valid) {
      return { success: false, message: validation.error || 'شماره تلفن نامعتبر است' };
    }

    if (!otpCode || otpCode.length !== 6) {
      return { success: false, message: 'کد تأیید باید ۶ رقم باشد' };
    }

    const normalizedPhone = normalizePhoneNumber(phoneNumber);
    console.log(`[OTP] Verifying OTP for: ${normalizedPhone}`);

    // Fetch the most recent OTP
    const otpFetchResponse = await fetch(
      `${STRAPI_URL}/api/otp-logs?filters[mobile][$eq]=${normalizedPhone}&sort=createdAt:desc&pagination[limit]=1&fields=*`,
      {
        headers: STRAPI_TOKEN ? { Authorization: 'Bearer ' + STRAPI_TOKEN } : {},
      }
    );

    if (!otpFetchResponse.ok) {
      throw new Error(`Failed to fetch OTP: ${otpFetchResponse.status}`);
    }
    const otpData = await otpFetchResponse.json();
    console.log(`otpData: ${JSON.stringify(otpData)}`);
    const otpRecord = otpData.data?.[0];
    console.log(`otpRecord.otp: ${JSON.stringify(otpRecord.otp)}`);

    if (!otpRecord) {
      return { success: false, message: 'کد تأیید درخواست نشده است' };
    }

    // Check if OTP is expired
    const expiresAt = new Date(otpRecord.expiresAt);
    if (new Date() > expiresAt) {
      return { success: false, message: 'کد تأیید منقضی شده است' };
    }

    // Check if max attempts exceeded
    if (otpRecord.attempts >= OTP_MAX_ATTEMPTS) {
      return { success: false, message: 'تعداد تلاش‌های ناموفق زیاد است' };
    }

    // Verify OTP code
    if (otpRecord.otp !== otpCode) {
      // Increment attempts
      await fetch(`${STRAPI_URL}/api/otp-logs/${otpRecord.documentId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          ...(STRAPI_TOKEN ? { Authorization: 'Bearer ' + STRAPI_TOKEN } : {}),
        },
        body: JSON.stringify({
          data: {
            attempts: otpRecord.attempts + 1,
          },
        }),
      });

      return { success: false, message: 'کد تأیید اشتباه است' };
    }

    // OTP verified successfully - get or create user
    const user = await getOrCreateUser(normalizedPhone);

    // Delete/invalidate the OTP
    await fetch(`${STRAPI_URL}/api/otp-logs/${otpRecord.id}`, {
      method: 'DELETE',
      headers: STRAPI_TOKEN ? { Authorization: 'Bearer ' + STRAPI_TOKEN } : {},
    });

    // Generate JWT token
    const token = generateToken({ userId: user.id, mobile: user.mobile, role: (user.role || 'USER') as 'USER' | 'REQUEST_ADMIN' | 'SUPER_ADMIN' });

    return {
      success: true,
      message: 'ورود موفقیت‌آمیز',
      userId: user.id,
      token,
    };
  } catch (error) {
    console.error('Error verifying OTP:', error);
    return {
      success: false,
      message: 'خطا در تأیید کد',
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

/**
 * Send OTP via SMS (gracefully fail if SMS service not available)
 */
async function sendOtpSms(phoneNumber: string, otp: string): Promise<void> {
  try {
    const farazUsername = process.env.FARAZ_SMS_USERNAME;
    const farazPassword = process.env.FARAZ_SMS_PASSWORD;
    const farazPatternId = process.env.FARAZ_SMS_PATTERN_ID;

    // If no SMS credentials configured, skip SMS sending
    if (!farazUsername || !farazPassword || !farazPatternId) {
      console.log('[OTP] SMS service not configured, skipping SMS sending');
      return;
    }

    const params = new URLSearchParams({
      username: farazUsername,
      password: farazPassword,
      to: phoneNumber,
      pattern_id: farazPatternId,
      token: otp,
    });

    const response = await fetch('https://ippanel.com/api/send-verify-code', {
      method: 'POST',
      body: params,
    });

    if (!response.ok) {
      console.error(`[SMS] Send failed: ${response.status} ${response.statusText}`);
    }
  } catch (error) {
    console.error('[SMS] Error sending SMS:', error);
    // Don't throw - SMS is not critical
  }
}

/**
 * Get existing user or create new one
 * Uses the custom CUser content type (api::user.user)
 * Collection: custom_users (has 'mobile' field)
 * Does NOT use plugin::users-permissions.user (which requires password)
 */
export async function getOrCreateUser(phoneNumber: string): Promise<{ id: string; mobile: string; role?: string }> {
  try {
    console.log(`[User] Getting or creating user: ${phoneNumber}`);

    // Query custom CUser by mobile number
    // Note: The custom user endpoint is /api/users but uses custom_users collection
    const userQuery = new URLSearchParams({
      'filters[mobile][$eq]': phoneNumber,
      'fields': 'id,mobile,role,otpVerified',
    });

    const fetchUrl = `${STRAPI_URL}/api/users?${userQuery.toString()}`;
    console.log(`[User] Querying user from custom CUser collection: ${fetchUrl}`);

    const userResponse = await fetch(fetchUrl, {
      headers: STRAPI_TOKEN ? { Authorization: 'Bearer ' + STRAPI_TOKEN } : {},
    });

    console.log(`[User] User query response status: ${userResponse.status}`);

    if (userResponse.ok) {
      const userData = await userResponse.json();
      console.log(`[User] User query response: ${JSON.stringify(userData)}`);

      const existingUser = userData.data?.[0];

      if (existingUser) {
        console.log(`[User] Found existing user: ${existingUser.id}`);
        return {
          id: String(existingUser.id),
          mobile: existingUser.mobile,
          role: existingUser.role || 'USER',
        };
      }
    }

    // User doesn't exist - create new one in custom CUser collection
    console.log(`[User] Creating new user for: ${phoneNumber} in custom CUser collection`);
    const createResponse = await fetch(`${STRAPI_URL}/api/users`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(STRAPI_TOKEN ? { Authorization: 'Bearer ' + STRAPI_TOKEN } : {}),
      },
      body: JSON.stringify({
        data: {
          mobile: phoneNumber,
          fullName: '',
          otpVerified: true,
          mobileVerifiedAt: new Date().toISOString(),
          role: 'USER',
          status: 'ACTIVE',
        },
      }),
    });

    console.log(`[User] Create response status: ${createResponse.status}`);

    if (!createResponse.ok) {
      const errorText = await createResponse.text();
      console.error(`[User] Create failed: ${createResponse.status} - ${errorText}`);
      throw new Error(`Failed to create user: ${createResponse.status} - ${errorText}`);
    }

    const newUserData = await createResponse.json();
    console.log(`[User] Create response: ${JSON.stringify(newUserData)}`);
    console.log(`[User] Created new user: ${newUserData.data.id}`);

    return {
      id: String(newUserData.data.id),
      mobile: newUserData.data.mobile,
      role: newUserData.data.role || 'USER',
    };
  } catch (error) {
    console.error('[User] Error in getOrCreateUser:', error);
    throw error;
  }
}

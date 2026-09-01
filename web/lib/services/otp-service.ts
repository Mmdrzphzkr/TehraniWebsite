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
  userId?: number;
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

    // Check for existing OTP
    const existingOtpResponse = await fetch(
      `${STRAPI_URL}/api/otp-logs?filters[mobile][$eq]=${normalizedPhone}&sort=createdAt:desc&pagination[limit]=1`,
      {
        headers: { Authorization: `Bearer ${STRAPI_TOKEN}` },
      }
    );

    if (!existingOtpResponse.ok) {
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

    const createOtpResponse = await fetch(`${STRAPI_URL}/api/otp-logs`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${STRAPI_TOKEN}`,
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

    if (!createOtpResponse.ok) {
      throw new Error(`Failed to create OTP: ${createOtpResponse.status}`);
    }

    const createdOtpData = await createOtpResponse.json();

    // Send SMS asynchronously
    sendOtpSms(normalizedPhone, newOtp).catch(console.error);

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
export async function verifyOtp(
  phoneNumber: string,
  otpCode: string
): Promise<VerifyOtpResponse> {
  try {
    const validation = validatePhoneNumber(phoneNumber);
    if (!validation.valid) {
      return { success: false, message: validation.error || 'شماره تلفن نامعتبر است' };
    }

    const normalizedPhone = normalizePhoneNumber(phoneNumber);

    if (!/^\d{6}$/.test(otpCode)) {
      return { success: false, message: 'کد تأیید باید 6 رقم باشد' };
    }

    // Get OTP log
    const otpResponse = await fetch(
      `${STRAPI_URL}/api/otp-logs?filters[mobile][$eq]=${normalizedPhone}&sort=createdAt:desc&pagination[limit]=1`,
      {
        headers: { Authorization: `Bearer ${STRAPI_TOKEN}` },
      }
    );

    if (!otpResponse.ok) {
      throw new Error(`Failed to fetch OTP: ${otpResponse.status}`);
    }

    const otpData = await otpResponse.json();
    const otpLog = otpData.data?.[0];

    if (!otpLog) {
      return { success: false, message: 'کد تأیید درخواست نشده است' };
    }

    // Check expiry
    const expiresAt = new Date(otpLog.expiresAt);
    if (new Date() > expiresAt) {
      return { success: false, message: 'کد تأیید منقضی شده است' };
    }

    // Check max attempts
    if (otpLog.attempts >= OTP_MAX_ATTEMPTS) {
      return { success: false, message: 'تعداد تلاش‌های نامعتبر به پایان رسیده است' };
    }

    // Verify code
    if (otpLog.otp !== otpCode) {
      await fetch(`${STRAPI_URL}/api/otp-logs/${otpLog.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${STRAPI_TOKEN}`,
        },
        body: JSON.stringify({
          data: { attempts: otpLog.attempts + 1 },
        }),
      });

      return {
        success: false,
        message: `کد تأیید نادرست است (${OTP_MAX_ATTEMPTS - otpLog.attempts - 1} تلاش باقی‌مانده)`,
      };
    }

    // Get or create user
    const userResult = await getOrCreateUser(normalizedPhone);
    if (!userResult.success) {
      return { success: false, message: userResult.error || 'خطا در ایجاد کاربر' };
    }

    // Mark OTP as used
    await fetch(`${STRAPI_URL}/api/otp-logs/${otpLog.id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${STRAPI_TOKEN}`,
      },
      body: JSON.stringify({
        data: { attempts: OTP_MAX_ATTEMPTS },
      }),
    }).catch(console.error);

    return {
      success: true,
      message: 'کد تأیید با موفقیت تأیید شد',
      userId: userResult.userId,
      token: userResult.token,
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
 * Get or create user
 */
async function getOrCreateUser(
  phoneNumber: string
): Promise<{ success: boolean; userId?: number; token?: string; error?: string }> {
  try {
    // Check existing user
    const userResponse = await fetch(
      `${STRAPI_URL}/api/users?filters[mobile][$eq]=${phoneNumber}&pagination[limit]=1`,
      {
        headers: { Authorization: `Bearer ${STRAPI_TOKEN}` },
      }
    );

    if (!userResponse.ok) {
      throw new Error(`Failed to fetch user: ${userResponse.status}`);
    }

    const userData = await userResponse.json();
    let user = userData.data?.[0];

    if (!user) {
      const createUserResponse = await fetch(`${STRAPI_URL}/api/users`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${STRAPI_TOKEN}`,
        },
        body: JSON.stringify({
          data: {
            mobile: phoneNumber,
            otpVerified: true,
            mobileVerifiedAt: new Date().toISOString(),
            status: 'ACTIVE',
            role: 'USER',
          },
        }),
      });

      if (!createUserResponse.ok) {
        throw new Error(`Failed to create user: ${createUserResponse.status}`);
      }

      user = (await createUserResponse.json()).data;
    } else {
      await fetch(`${STRAPI_URL}/api/users/${user.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${STRAPI_TOKEN}`,
        },
        body: JSON.stringify({
          data: {
            otpVerified: true,
            mobileVerifiedAt: new Date().toISOString(),
          },
        }),
      }).catch(console.error);
    }

    const token = generateToken({
      userId: user.id,
      role: user.role || 'USER',
      mobile: user.mobile,
    });

    return { success: true, userId: user.id, token };
  } catch (error) {
    console.error('Error in getOrCreateUser:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

/**
 * Send OTP via FarazSMS
 */
async function sendOtpSms(phoneNumber: string, otpCode: string): Promise<void> {
  try {
    const apiKey = process.env.FARAZSMS_APIKEY;
    const from = process.env.FARAZSMS_FROM;
    const patternCode = process.env.FARAZSMS_PATTERN_CODE;

    if (!apiKey || !from || !patternCode) {
      console.warn('FarazSMS configuration incomplete');
      return;
    }

    const response = await fetch('https://api.iranpayamak.com/ws/v1/sms/pattern', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Api-Key': apiKey,
        Accept: 'application/json',
      },
      body: JSON.stringify({
        code: patternCode,
        recipient: phoneNumber,
        line_number: from,
        attributes: { otp: otpCode },
        number_format: 'english',
      }),
    });

    if (!response.ok) {
      console.error(`FarazSMS error: ${response.status}`);
    }
  } catch (error) {
    console.error('Error sending OTP SMS:', error);
  }
}

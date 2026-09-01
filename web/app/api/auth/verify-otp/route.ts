import { NextRequest, NextResponse } from 'next/server';
import { verifyOtp } from '@/lib/services/otp-service';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { phoneNumber, otpCode } = body;

    if (!phoneNumber || !otpCode) {
      return NextResponse.json(
        { success: false, message: 'شماره تلفن و کد تأیید الزامی هستند' },
        { status: 400 }
      );
    }

    const result = await verifyOtp(phoneNumber, otpCode);

    if (result.success && result.token) {
      const response = NextResponse.json(
        { success: true, message: 'ورود موفقیت‌آمیز', userId: result.userId },
        { status: 200 }
      );

      response.cookies.set('auth-token', result.token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 7 * 24 * 60 * 60,
        path: '/',
      });

      return response;
    }

    return NextResponse.json(result, { status: result.success ? 200 : 400 });
  } catch (error) {
    console.error('Error in verify-otp:', error);
    return NextResponse.json(
      { success: false, message: 'خطای سرور' },
      { status: 500 }
    );
  }
}

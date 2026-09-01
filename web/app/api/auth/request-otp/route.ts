import { NextRequest, NextResponse } from 'next/server';
import { requestOtp } from '@/lib/services/otp-service';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { phoneNumber } = body;

    if (!phoneNumber || typeof phoneNumber !== 'string') {
      return NextResponse.json(
        { success: false, message: 'شماره تلفن الزامی است' },
        { status: 400 }
      );
    }

    const result = await requestOtp(phoneNumber);
    return NextResponse.json(result, { status: result.success ? 200 : 400 });
  } catch (error) {
    console.error('Error in request-otp:', error);
    return NextResponse.json(
      { success: false, message: 'خطای سرور' },
      { status: 500 }
    );
  }
}

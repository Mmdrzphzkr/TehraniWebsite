'use client';

import { useAuth } from '@/lib/context/auth-context';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Link from 'next/link';

type Step = 'phone' | 'otp';

export default function AuthPage() {
  const router = useRouter();
  const { isAuthenticated, isLoading } = useAuth();
  const [step, setStep] = useState<Step>('phone');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [otpCode, setOtpCode] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [remainingTime, setRemainingTime] = useState(0);
  const { requestOtp, login, error: authError, clearError } = useAuth();

  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      router.push('/dashboard');
    }
  }, [isAuthenticated, isLoading, router]);

  useEffect(() => {
    return () => clearError();
  }, [clearError]);

  useEffect(() => {
    if (remainingTime <= 0) return;
    const timer = setInterval(() => {
      setRemainingTime((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [remainingTime]);

  useEffect(() => {
    if (authError) {
      setError(authError);
    }
  }, [authError]);

  const handleRequestOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!phoneNumber) {
      setError('شماره تلفن الزامی است');
      return;
    }

    try {
      setIsSubmitting(true);
      await requestOtp(phoneNumber);
      setStep('otp');
      setRemainingTime(60);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'خطا در درخواست کد');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!otpCode || otpCode.length !== 6) {
      setError('کد تأیید باید 6 رقم باشد');
      return;
    }

    try {
      setIsSubmitting(true);
      await login(phoneNumber, otpCode);
      router.push('/dashboard');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'خطا در تأیید کد');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <main className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100">
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-navy mx-auto mb-4"></div>
            <p className="text-slate-600">درحال بارگذاری...</p>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100">
      <div className="flex items-center justify-center min-h-screen px-4">
        <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-8">
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold text-brand-navy-dark mb-2">
              مؤسسه آزاد سینمایی طهرانی
            </h1>
            <p className="text-slate-600">{step === 'phone' ? 'ورود | ثبت‌نام' : 'تأیید کد'}</p>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-sm text-red-700">{error}</p>
            </div>
          )}

          {step === 'phone' && (
            <form onSubmit={handleRequestOtp} className="space-y-4">
              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-slate-700 mb-2">
                  شماره موبایل
                </label>
                <input
                  id="phone"
                  type="tel"
                  placeholder="۰۹xxxxxxxxx"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value.replace(/\D/g, ''))}
                  disabled={isSubmitting}
                  className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand-navy focus:border-transparent outline-none disabled:bg-slate-100"
                  maxLength={11}
                />
                <p className="mt-2 text-xs text-slate-500">
                  شماره تلفن همراه خود را وارد کنید. کد تأیید برای شما ارسال خواهد شد.
                </p>
              </div>

              <button
                type="submit"
                disabled={isSubmitting || !phoneNumber}
                className="w-full bg-brand-navy text-white py-3 rounded-lg font-semibold hover:bg-brand-navy-dark disabled:bg-slate-300 disabled:cursor-not-allowed transition-colors"
              >
                {isSubmitting ? 'درحال ارسال...' : 'درخواست کد تأیید'}
              </button>

              <p className="text-center text-sm text-slate-600 mt-4">
                با درخواست کد تأیید، شما شرایط استفاده و حریم خصوصی را می‌پذیرید.
              </p>
            </form>
          )}

          {step === 'otp' && (
            <form onSubmit={handleVerifyOtp} className="space-y-4">
              <div>
                <label htmlFor="otp" className="block text-sm font-medium text-slate-700 mb-2">
                  کد تأیید
                </label>
                <p className="text-sm text-slate-600 mb-3">
                  کد ۶ رقمی ارسال شده به <span className="font-semibold">{phoneNumber}</span>
                  را وارد کنید.
                </p>
                <input
                  id="otp"
                  type="text"
                  placeholder="۰۰۰۰۰۰"
                  value={otpCode}
                  onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, ''))}
                  disabled={isSubmitting}
                  className="w-full px-4 py-3 text-center text-2xl border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand-navy focus:border-transparent outline-none disabled:bg-slate-100"
                  maxLength={6}
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting || otpCode.length !== 6}
                className="w-full bg-brand-navy text-white py-3 rounded-lg font-semibold hover:bg-brand-navy-dark disabled:bg-slate-300 disabled:cursor-not-allowed transition-colors"
              >
                {isSubmitting ? 'درحال تأیید...' : 'تأیید کد'}
              </button>

              <button
                type="button"
                onClick={() => {
                  setStep('phone');
                  setOtpCode('');
                  setError('');
                  setRemainingTime(0);
                }}
                disabled={isSubmitting}
                className="w-full py-2 text-brand-navy hover:text-brand-navy-dark font-semibold disabled:text-slate-400 transition-colors"
              >
                تغییر شماره تلفن
              </button>

              {remainingTime > 0 && (
                <p className="text-center text-sm text-slate-500 mt-4">
                  درخواست مجدد کد تأیید تا {remainingTime} ثانیه
                </p>
              )}

              {remainingTime === 0 && (
                <button
                  type="button"
                  onClick={() => {
                    setOtpCode('');
                    setError('');
                    handleRequestOtp({ preventDefault: () => {} } as React.FormEvent);
                  }}
                  disabled={isSubmitting}
                  className="w-full py-2 text-brand-navy hover:text-brand-navy-dark font-semibold disabled:text-slate-400 transition-colors"
                >
                  درخواست مجدد کد تأیید
                </button>
              )}
            </form>
          )}

          <div className="mt-8 pt-6 border-t border-slate-200 text-center text-sm text-slate-600">
            <p>
              با ورود به‌حساب{' '}
              <Link href="/" className="text-brand-navy hover:underline">
                شرایط استفاده
              </Link>
              و{' '}
              <Link href="/" className="text-brand-navy hover:underline">
                حریم خصوصی
              </Link>
              {' '}
              موافقت می‌کنید.
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}

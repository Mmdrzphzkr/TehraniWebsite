'use client';

import {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
  ReactNode,
} from 'react';

export interface AuthUser {
  id: number;
  mobile: string;
  role: 'USER' | 'REQUEST_ADMIN' | 'SUPER_ADMIN';
}

interface AuthContextType {
  user: AuthUser | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (phoneNumber: string, otpCode: string) => Promise<void>;
  logout: () => Promise<void>;
  requestOtp: (phoneNumber: string) => Promise<void>;
  error: string | null;
  clearError: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const response = await fetch('/api/auth/me');
      if (response.ok) {
        const data = await response.json();
        if (data.authenticated) {
          setUser(data.user);
        }
      }
    } catch (err) {
      console.error('Error checking auth:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const requestOtp = useCallback(async (phoneNumber: string) => {
    setError(null);
    try {
      const response = await fetch('/api/auth/request-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phoneNumber }),
      });

      const data = await response.json();

      if (!data.success) {
        setError(data.message || 'خطا در درخواست کد تأیید');
        throw new Error(data.message || 'Failed to request OTP');
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : 'خطا در درخواست کد تأیید';
      setError(message);
      throw err;
    }
  }, []);

  const login = useCallback(async (phoneNumber: string, otpCode: string) => {
    setError(null);
    try {
      const response = await fetch('/api/auth/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phoneNumber, otpCode }),
      });

      const data = await response.json();

      if (!data.success) {
        setError(data.message || 'خطا در ورود');
        throw new Error(data.message || 'Failed to login');
      }

      await checkAuth();
    } catch (err) {
      const message = err instanceof Error ? err.message : 'خطا در ورود';
      setError(message);
      throw err;
    }
  }, []);

  const logout = useCallback(async () => {
    setError(null);
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
      setUser(null);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'خطا در خروج';
      setError(message);
      throw err;
    }
  }, []);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isAuthenticated: !!user,
        login,
        logout,
        requestOtp,
        error,
        clearError,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}

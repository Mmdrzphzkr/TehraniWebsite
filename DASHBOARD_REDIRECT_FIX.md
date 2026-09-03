# Dashboard Redirect Issue - Root Cause & Fix

## Problem Statement

After successful OTP login:
- User successfully logs in (JWT token created and cookie set)
- Header component displays user state correctly
- But navigating to `/dashboard` redirects back to `/auth` page
- Despite the backend confirming `authenticated: true`

## Root Cause Analysis

### Issue: Missing Dependency in `login` Function

**File:** `web/lib/context/auth-context.tsx`  
**Lines:** 80-102  

The `login` function has a **critical React dependency issue**:

```tsx
const login = useCallback(async (phoneNumber: string, otpCode: string) => {
  // ... code ...
  await checkAuth();  // <-- checkAuth is called here
  // ... code ...
}, []);  // <-- BUG: checkAuth is NOT in dependency array!
```

### Why This Breaks Dashboard Access

When `login` is called:
1. It sends OTP verification to backend
2. Backend sets the `auth-token` cookie
3. Frontend calls `await checkAuth()` to load user state
4. **BUT:** The `checkAuth` function reference is stale because it's not in the dependency array
5. React warnings: "checkAuth dependency missing from useCallback"
6. The `checkAuth()` call may fail or use outdated closure state
7. User state might not be set correctly
8. Dashboard checks `isAuthenticated` and finds it's still `false` → redirects to auth

### How Dashboard Protection Works

**File:** `web/app/dashboard/page.tsx`  
**Lines:** 32-37

```tsx
useEffect(() => {
  console.log('DashboardPage: isLoading:', isLoading, 'isAuthenticated:', isAuthenticated);
  if (!isLoading && !isAuthenticated) {
    router.push('/auth');
  }
}, [isAuthenticated, isLoading, router]);
```

The dashboard requires:
- `isLoading === false` (initial auth check complete)
- `isAuthenticated === true` (user state has been loaded)

If `isAuthenticated` is still `false` after loading completes, redirect to auth.

## Solution

### Fix: Add `checkAuth` to `login` Dependency Array

**File:** `web/lib/context/auth-context.tsx`

**Before:**
```tsx
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
}, []);  // ❌ Missing checkAuth dependency
```

**After:**
```tsx
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
}, [checkAuth]);  // ✅ checkAuth is now in dependency array
```

## Why This Fix Works

1. **Stable Function Reference:** Adding `checkAuth` to dependencies ensures the function reference is always current
2. **Correct Closure:** The `login` function now correctly closes over the latest `checkAuth` function
3. **Proper State Updates:** After login, `checkAuth()` correctly reads the cookie and calls `setUser()`
4. **Dashboard State:** The `isAuthenticated` flag becomes `true`, allowing dashboard access

## Verification Flow

After the fix, the complete login → dashboard flow should be:

```
1. User enters phone number
   ↓
2. User receives OTP via SMS
   ↓
3. User enters OTP code
   ↓
4. Frontend calls /api/auth/verify-otp
   ↓
5. Backend verifies OTP and sets auth-token cookie
   ↓
6. Frontend calls checkAuth() (with correct reference now!)
   ↓
7. checkAuth() calls /api/auth/me
   ↓
8. Backend reads cookie, verifies JWT, returns user data
   ↓
9. Frontend setUser() is called with user data
   ↓
10. isAuthenticated becomes true, isLoading becomes false
   ↓
11. Dashboard check passes: can access dashboard
   ↓
12. User can navigate freely and can log out
```

## Testing Checklist

- [ ] Complete OTP flow: phone → OTP → verification
- [ ] Header displays user mobile number and avatar
- [ ] Dashboard is accessible after login
- [ ] Page refresh maintains session
- [ ] Logout clears session and returns to login button
- [ ] Mobile responsive menu shows authenticated state

## Related Issues Fixed in Prior Sessions

1. **HTTP 426 Error** - Fixed corrupted Bearer token headers
2. **OTP Field Missing** - Unchecked "Private" checkbox in Strapi
3. **User Creation 400 Error** - Fixed to use custom CUser schema
4. **Header Not Showing User** - Added useAuth hook to Header component
5. **Auth Context Race Condition** - Fixed useEffect dependencies

## Files Modified

- `web/lib/context/auth-context.tsx` (line 102)
  - Changed `}, []);` to `}, [checkAuth]);` in login function

## Build Status

✅ TypeScript: 0 errors  
✅ Build: Passed  
✅ Dev Server: Running on http://localhost:3000

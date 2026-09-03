import { jwtVerify } from 'jose';
import type { JwtPayload } from './jwt';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';
const encodedSecret = new TextEncoder().encode(JWT_SECRET);

/**
 * Verify and decode a JWT token using the Web Crypto API (jose).
 *
 * `jsonwebtoken` relies on Node's `crypto` module, which is not available in
 * the Edge Runtime that Next.js middleware executes in. Using it there makes
 * every verification silently fail (caught and turned into `null`), which
 * causes authenticated users to be redirected back to `/auth` in a loop.
 *
 * This function must be used in `middleware.ts` (and any other Edge Runtime
 * code). Node.js API routes should keep using `verifyToken` from `./jwt`.
 */
export async function verifyTokenEdge(token: string): Promise<JwtPayload | null> {
  try {
    const { payload } = await jwtVerify(token, encodedSecret);
    return payload as unknown as JwtPayload;
  } catch {
    return null;
  }
}

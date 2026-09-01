import { cookies } from 'next/headers';
import { verifyToken } from '@/lib/utils/jwt';
import { getRequestById } from '@/lib/services/request-service';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    // Get user ID from JWT token
    const cookieStore = await cookies();
    const token = cookieStore.get('auth-token')?.value;

    if (!token) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const payload = await verifyToken(token);
    if (!payload?.userId) {
      return Response.json({ error: 'Invalid token' }, { status: 401 });
    }

    // Fetch request from Strapi
    const req = await getRequestById(id);

    if (!req) {
      return Response.json({ error: 'Request not found' }, { status: 404 });
    }

    // Verify that the request belongs to the current user
    if (req.user?.id !== payload.userId) {
      return Response.json({ error: 'Forbidden' }, { status: 403 });
    }

    return Response.json({ request: req });
  } catch (error) {
    console.error('Request detail error:', error);
    return Response.json(
      { error: 'Failed to fetch request' },
      { status: 500 }
    );
  }
}

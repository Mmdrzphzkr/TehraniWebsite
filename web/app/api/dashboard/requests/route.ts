import { cookies } from 'next/headers';
import { verifyToken } from '@/lib/utils/jwt';
import { getUserRequests } from '@/lib/services/request-service';

export async function GET(request: Request) {
  try {
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

    // Parse query parameters
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const pageSize = parseInt(searchParams.get('pageSize') || '10');
    const status = searchParams.get('status') || undefined;
    const type = searchParams.get('type') || undefined;

    // Fetch requests from Strapi
    const response = await getUserRequests(payload.userId, {
      page,
      pageSize,
      status,
      type,
      sortBy: 'newest',
    });

    return Response.json({
      requests: response.data,
      pagination: response.meta.pagination,
    });
  } catch (error) {
    console.error('Dashboard requests error:', error);
    return Response.json(
      { error: 'Failed to fetch requests' },
      { status: 500 }
    );
  }
}

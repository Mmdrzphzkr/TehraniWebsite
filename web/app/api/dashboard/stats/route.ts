import { cookies } from 'next/headers';
import { verifyToken } from '@/lib/utils/jwt';
import { getRequestStats, getRecentRequests } from '@/lib/services/request-service';

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

    // Fetch stats
    const stats = await getRequestStats(payload.userId);
    const recentRequests = await getRecentRequests(payload.userId, 5);

    return Response.json({
      totalRequests: stats.total,
      byStatus: stats.byStatus,
      recentRequests,
    });
  } catch (error) {
    console.error('Dashboard stats error:', error);
    return Response.json(
      { error: 'Failed to fetch stats' },
      { status: 500 }
    );
  }
}

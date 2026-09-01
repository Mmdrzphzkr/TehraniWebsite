import { cookies } from 'next/headers';
import { verifyToken } from '@/lib/utils/jwt';
import { getUserCourseEventRequests } from '@/lib/services/request-service';

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

    // Fetch course/event requests
    const { courses, events } = await getUserCourseEventRequests(payload.userId);

    return Response.json({ courses, events });
  } catch (error) {
    console.error('Course/event requests error:', error);
    return Response.json(
      { error: 'Failed to fetch requests' },
      { status: 500 }
    );
  }
}

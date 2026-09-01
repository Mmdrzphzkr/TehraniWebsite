interface IRequest {
  id: string;
  documentId: string;
  type: 'CONSULTATION' | 'COOPERATION' | 'EQUIPMENT_RENTAL' | 'SPACE_RENTAL' | 'CONTACT' | 'EVENT_PARTICIPATION' | 'COURSE_PARTICIPATION';
  status: 'NEW' | 'IN_REVIEW' | 'CONTACTED' | 'APPROVED' | 'REJECTED' | 'CLOSED';
  submittedAt: string;
  closedAt?: string;
  payload: Record<string, any>;
  internalNotes?: string;
  relatedCourseWorkshop?: {
    id: string;
    documentId: string;
    title: string;
    slug: string;
  };
  relatedEvent?: {
    id: string;
    documentId: string;
    title: string;
    slug: string;
  };
  user?: {
    id: string;
    documentId: string;
    fullName: string;
    mobile: string;
  };
  createdAt: string;
  updatedAt: string;
}

interface IRequestResponse {
  data: IRequest[];
  meta: {
    pagination: {
      page: number;
      pageSize: number;
      pageCount: number;
      total: number;
    };
  };
}

const strapiUrl = process.env.NEXT_PUBLIC_STRAPI_URL || 'http://localhost:1337';
const strapiToken = process.env.STRAPI_API_TOKEN;

/**
 * Get all requests for a user with optional filters and pagination
 */
export async function getUserRequests(
  userId: string,
  options?: {
    page?: number;
    pageSize?: number;
    type?: string;
    status?: string;
    sortBy?: 'newest' | 'oldest';
  }
): Promise<IRequestResponse> {
  const page = options?.page || 1;
  const pageSize = options?.pageSize || 10;
  const sort = options?.sortBy === 'oldest' ? 'submittedAt:asc' : 'submittedAt:desc';

  const filters: string[] = [`filters[user][id][$eq]=${userId}`];

  if (options?.type) {
    filters.push(`filters[type][$eq]=${options.type}`);
  }

  if (options?.status) {
    filters.push(`filters[status][$eq]=${options.status}`);
  }

  const queryParams = new URLSearchParams({
    pagination: `page=${page}&pageSize=${pageSize}`,
    sort,
    populate: 'relatedCourseWorkshop,relatedEvent,user',
  });

  const url = `${strapiUrl}/api/requests?${filters.join('&')}&sort=${sort}&pagination[page]=${page}&pagination[pageSize]=${pageSize}&populate=relatedCourseWorkshop,relatedEvent,user`;

  try {
    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${strapiToken}`,
      },
      cache: 'no-store',
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch requests: ${response.statusText}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching user requests:', error);
    throw error;
  }
}

/**
 * Get a single request by ID
 */
export async function getRequestById(requestId: string): Promise<IRequest | null> {
  const url = `${strapiUrl}/api/requests/${requestId}?populate=relatedCourseWorkshop,relatedEvent,user`;

  try {
    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${strapiToken}`,
      },
      cache: 'no-store',
    });

    if (!response.ok) {
      if (response.status === 404) {
        return null;
      }
      throw new Error(`Failed to fetch request: ${response.statusText}`);
    }

    const data = await response.json();
    return data.data;
  } catch (error) {
    console.error('Error fetching request by ID:', error);
    throw error;
  }
}

/**
 * Create a new request
 */
export async function createRequest(
  userId: string,
  type: IRequest['type'],
  payload: Record<string, any>,
  relatedCourseWorkshopId?: string,
  relatedEventId?: string
): Promise<IRequest> {
  const requestData = {
    data: {
      type,
      payload,
      status: 'NEW',
      submittedAt: new Date().toISOString(),
      user: userId,
      ...(relatedCourseWorkshopId && { relatedCourseWorkshop: relatedCourseWorkshopId }),
      ...(relatedEventId && { relatedEvent: relatedEventId }),
    },
  };

  const url = `${strapiUrl}/api/requests`;

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${strapiToken}`,
      },
      body: JSON.stringify(requestData),
    });

    if (!response.ok) {
      throw new Error(`Failed to create request: ${response.statusText}`);
    }

    const data = await response.json();
    return data.data;
  } catch (error) {
    console.error('Error creating request:', error);
    throw error;
  }
}

/**
 * Get request statistics for a user
 */
export async function getRequestStats(userId: string): Promise<{
  total: number;
  byStatus: Record<string, number>;
  byType: Record<string, number>;
}> {
  try {
    const response = await getUserRequests(userId, { pageSize: 1000 });
    const requests = response.data;

    const stats = {
      total: response.meta.pagination.total,
      byStatus: {} as Record<string, number>,
      byType: {} as Record<string, number>,
    };

    requests.forEach((request) => {
      stats.byStatus[request.status] = (stats.byStatus[request.status] || 0) + 1;
      stats.byType[request.type] = (stats.byType[request.type] || 0) + 1;
    });

    return stats;
  } catch (error) {
    console.error('Error fetching request stats:', error);
    throw error;
  }
}

/**
 * Get course/event participation requests for a user
 */
export async function getUserCourseEventRequests(userId: string): Promise<{
  courses: IRequest[];
  events: IRequest[];
}> {
  try {
    const courseResponse = await getUserRequests(userId, {
      type: 'COURSE_PARTICIPATION',
      pageSize: 100,
    });

    const eventResponse = await getUserRequests(userId, {
      type: 'EVENT_PARTICIPATION',
      pageSize: 100,
    });

    return {
      courses: courseResponse.data,
      events: eventResponse.data,
    };
  } catch (error) {
    console.error('Error fetching course/event requests:', error);
    throw error;
  }
}

/**
 * Get recent requests for dashboard
 */
export async function getRecentRequests(userId: string, limit: number = 5): Promise<IRequest[]> {
  try {
    const response = await getUserRequests(userId, {
      pageSize: limit,
      sortBy: 'newest',
    });

    return response.data;
  } catch (error) {
    console.error('Error fetching recent requests:', error);
    throw error;
  }
}

/**
 * Format request type for display
 */
export function formatRequestType(type: IRequest['type']): string {
  const typeLabels: Record<IRequest['type'], string> = {
    CONSULTATION: 'مشاوره تولیدات سینمایی',
    COOPERATION: 'درخواست همکاری',
    EQUIPMENT_RENTAL: 'درخواست اجاره تجهیزات',
    SPACE_RENTAL: 'درخواست اجاره فضا',
    CONTACT: 'درخواست تماس',
    EVENT_PARTICIPATION: 'درخواست شرکت در رویداد',
    COURSE_PARTICIPATION: 'درخواست شرکت در دوره',
  };

  return typeLabels[type] || type;
}

/**
 * Format request status for display
 */
export function formatRequestStatus(status: IRequest['status']): string {
  const statusLabels: Record<IRequest['status'], string> = {
    NEW: 'جدید',
    IN_REVIEW: 'در حال بررسی',
    CONTACTED: 'تماس گرفته شده',
    APPROVED: 'تأیید شده',
    REJECTED: 'رد شده',
    CLOSED: 'بسته شده',
  };

  return statusLabels[status] || status;
}

/**
 * Get status badge color
 */
export function getStatusColor(status: IRequest['status']): string {
  const colors: Record<IRequest['status'], string> = {
    NEW: 'bg-blue-100 text-blue-800',
    IN_REVIEW: 'bg-yellow-100 text-yellow-800',
    CONTACTED: 'bg-purple-100 text-purple-800',
    APPROVED: 'bg-green-100 text-green-800',
    REJECTED: 'bg-red-100 text-red-800',
    CLOSED: 'bg-gray-100 text-gray-800',
  };

  return colors[status] || 'bg-gray-100 text-gray-800';
}

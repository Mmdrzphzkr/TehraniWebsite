import { cookies } from 'next/headers';
import { verifyToken } from '@/lib/utils/jwt';
import { requestPayloadSchema, RequestType } from '@/lib/schemas/request-forms';

const STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_URL || 'http://localhost:1337';
const STRAPI_API_TOKEN = process.env.STRAPI_API_TOKEN;

interface StrapiError {
  error?: {
    status: number;
    name: string;
    message: string;
  };
}

export async function POST(request: Request) {
  try {
    // Verify authentication
    const cookieStore = await cookies();
    const token = cookieStore.get('auth-token')?.value;

    if (!token) {
      return Response.json({ success: false, error: 'بدون احراز هویت' }, { status: 401 });
    }

    const payload = await verifyToken(token);
    if (!payload?.userId) {
      return Response.json({ success: false, error: 'رمز نامعتبر' }, { status: 401 });
    }

    const userId = payload.userId;

    // Parse request body
    const body = await request.json();
    const { type, payload: formPayload, relatedCourseWorkshopId, relatedEventId } = body;

    // Validate request type
    if (!type || !Object.values(RequestType).includes(type)) {
      return Response.json(
        { success: false, error: 'نوع درخواست نامعتبر است' },
        { status: 400 }
      );
    }

    // Validate payload against schema
    let validatedPayload;
    try {
      validatedPayload = requestPayloadSchema.parse({
        type,
        ...formPayload,
      });
    } catch (error: unknown) {
      if (error && typeof error === 'object' && 'issues' in error) {
        const fieldErrors: Record<string, string> = {};
        const issues = (error as { issues: Array<{ path: (string | number)[]; message: string }> }).issues;
        for (const err of issues) {
          const path = err.path.join('.');
          fieldErrors[path] = err.message;
        }
        return Response.json(
          { success: false, error: 'خطای اعتبارسنجی', fieldErrors },
          { status: 400 }
        );
      }
      throw error;
    }

    // Check for duplicate participation requests (course and event types)
    if (type === RequestType.COURSE_PARTICIPATION || type === RequestType.EVENT_PARTICIPATION) {
      const relatedId =
        type === RequestType.COURSE_PARTICIPATION
          ? relatedCourseWorkshopId || (validatedPayload as any).courseWorkshopId
          : relatedEventId || (validatedPayload as any).eventId;

      if (relatedId) {
        const filterField =
          type === RequestType.COURSE_PARTICIPATION ? 'relatedCourseWorkshopId' : 'relatedEventId';

        const duplicateCheckUrl = new URL(`${STRAPI_URL}/api/requests`);
        duplicateCheckUrl.searchParams.append(`filters[userId][$eq]`, userId);
        duplicateCheckUrl.searchParams.append(`filters[type][$eq]`, type);
        duplicateCheckUrl.searchParams.append(`filters[${filterField}][$eq]`, relatedId);
        duplicateCheckUrl.searchParams.append('pagination[limit]', '1');

        const duplicateResponse = await fetch(duplicateCheckUrl.toString(), {
          headers: {
            'Authorization': `Bearer ${STRAPI_API_TOKEN}`,
            'Content-Type': 'application/json',
          },
        });

        const duplicateData = (await duplicateResponse.json()) as { data?: unknown[] };
        if (duplicateData.data && Array.isArray(duplicateData.data) && duplicateData.data.length > 0) {
          return Response.json(
            {
              success: false,
              error: 'شما قبلاً برای این مورد یک درخواست ثبت کرده‌اید',
            },
            { status: 409 }
          );
        }
      }
    }

    // Create request record in Strapi
    const createRequestUrl = `${STRAPI_URL}/api/requests`;
    const requestData = {
      data: {
        userId,
        type,
        status: 'NEW',
        payload: validatedPayload,
        relatedCourseWorkshopId:
          type === RequestType.COURSE_PARTICIPATION ? relatedCourseWorkshopId : undefined,
        relatedEventId: type === RequestType.EVENT_PARTICIPATION ? relatedEventId : undefined,
      },
    };

    const createResponse = await fetch(createRequestUrl, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${STRAPI_API_TOKEN}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestData),
    });

    const responseData = (await createResponse.json()) as StrapiError & { data?: { id: string } };

    if (!createResponse.ok) {
      console.error('Strapi error:', responseData);
      const errorMessage = responseData.error?.message || 'خطا در ایجاد درخواست';
      return Response.json(
        { success: false, error: errorMessage },
        { status: createResponse.status }
      );
    }

    return Response.json(
      {
        success: true,
        message: 'درخواست با موفقیت ثبت شد',
        requestId: responseData.data?.id,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error submitting request:', error);
    return Response.json(
      { success: false, error: 'خطای سرور' },
      { status: 500 }
    );
  }
}

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
    // Course/Event participation requests have no user-facing form fields —
    // the selected course/event id travels via relatedCourseWorkshopId /
    // relatedEventId at the top level of the request body. Merge it into the
    // payload here so it satisfies courseParticipationRequestSchema /
    // eventParticipationRequestSchema (which validate payload.courseWorkshopId
    // / payload.eventId).
    const payloadForValidation: Record<string, unknown> = { type, ...formPayload };
    if (type === RequestType.COURSE_PARTICIPATION) {
      payloadForValidation.courseWorkshopId = relatedCourseWorkshopId;
    } else if (type === RequestType.EVENT_PARTICIPATION) {
      payloadForValidation.eventId = relatedEventId;
    }

    let validatedPayload;
    try {
      validatedPayload = requestPayloadSchema.parse(payloadForValidation);
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
        // Strapi relation fields are named `user`, `relatedCourseWorkshop` and
        // `relatedEvent` (see cms/src/api/request/content-types/request/schema.json).
        // Relation filters must target the related entity's id.
        const relationField =
          type === RequestType.COURSE_PARTICIPATION ? 'relatedCourseWorkshop' : 'relatedEvent';

        const duplicateCheckUrl = new URL(`${STRAPI_URL}/api/requests`);
        duplicateCheckUrl.searchParams.append(`filters[user][id][$eq]`, userId);
        duplicateCheckUrl.searchParams.append(`filters[type][$eq]`, type);
        duplicateCheckUrl.searchParams.append(`filters[${relationField}][id][$eq]`, relatedId);
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
    // Field names must match cms/src/api/request/content-types/request/schema.json:
    // `user` (relation), `relatedCourseWorkshop` (relation), `relatedEvent` (relation),
    // and `submittedAt` (required datetime).
    const createRequestUrl = `${STRAPI_URL}/api/requests`;
    const requestData = {
      data: {
        user: userId,
        type,
        status: 'NEW',
        submittedAt: new Date().toISOString(),
        payload: validatedPayload,
        ...(type === RequestType.COURSE_PARTICIPATION && relatedCourseWorkshopId
          ? { relatedCourseWorkshop: relatedCourseWorkshopId }
          : {}),
        ...(type === RequestType.EVENT_PARTICIPATION && relatedEventId
          ? { relatedEvent: relatedEventId }
          : {}),
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

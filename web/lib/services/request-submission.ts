/**
 * Request submission utilities for client-side form handling
 */

import { RequestType, RequestPayload } from '@/lib/schemas/request-forms';

export interface RequestSubmissionResponse {
  success: boolean;
  message?: string;
  error?: string;
  fieldErrors?: Record<string, string>;
  requestId?: string;
  status?: number;
}

/**
 * Submit a request form to the API
 */
export async function submitRequest(
  type: RequestType,
  payload: Record<string, unknown>,
  relatedIds?: {
    relatedCourseWorkshopId?: string;
    relatedEventId?: string;
  }
): Promise<RequestSubmissionResponse> {
  try {
    const response = await fetch('/api/requests/submit', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        type,
        payload,
        ...relatedIds,
      }),
    });

    const data = (await response.json()) as RequestSubmissionResponse;

    if (!response.ok) {
      return {
        success: false,
        error: data.error || 'خطای نامشخص در ارسال درخواست',
        fieldErrors: data.fieldErrors,
        status: response.status,
      };
    }

    return { ...data, status: response.status };
  } catch (error) {
    console.error('Error submitting request:', error);
    return {
      success: false,
      error: 'خطا در اتصال به سرور',
    };
  }
}

/**
 * Prepare request payload based on type
 */
export function prepareRequestPayload(
  type: RequestType,
  formData: Record<string, unknown>
): Record<string, unknown> {
  // Remove type field if present, as it's passed separately
  const { type: _, ...payload } = formData;
  return payload;
}

/**
 * Parse field errors for form display
 */
export function parseFieldErrors(errors: Record<string, string> | undefined): Record<string, string> {
  if (!errors) return {};

  const result: Record<string, string> = {};
  Object.entries(errors).forEach(([path, message]) => {
    // Convert "payload.fieldName" to "fieldName"
    const fieldName = path.replace('payload.', '').split('.')[0];
    result[fieldName] = message;
  });
  return result;
}

/**
 * Check if field has error
 */
export function getFieldError(
  fieldName: string,
  errors: Record<string, string> | undefined
): string | undefined {
  if (!errors) return undefined;
  return errors[fieldName];
}

/**
 * Format field error for display
 */
export function formatFieldError(error: string | undefined): string {
  return error || '';
}

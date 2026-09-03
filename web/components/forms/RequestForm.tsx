'use client';

import { ReactNode, useState } from 'react';
import { useRouter } from 'next/navigation';
import { RequestType, REQUEST_TYPE_LABELS } from '@/lib/schemas/request-forms';
import { useToast } from '@/lib/context/toast-context';
import {
  submitRequest,
  parseFieldErrors,
  getFieldError,
  formatFieldError,
} from '@/lib/services/request-submission';

interface FormField {
  name: string;
  label: string;
  type: 'text' | 'textarea' | 'email' | 'tel' | 'number' | 'date' | 'time' | 'select' | 'url';
  required?: boolean;
  placeholder?: string;
  maxLength?: number;
  min?: number;
  max?: number;
  step?: number | string;
  options?: { label: string; value: string }[];
  helper?: string;
  pattern?: string;
}

interface RequestFormProps {
  type: RequestType;
  fields: FormField[];
  onSuccess?: () => void;
  onError?: (error: string) => void;
  children?: ReactNode;
  relatedIds?: {
    relatedCourseWorkshopId?: string;
    relatedEventId?: string;
  };
}

export function RequestForm({
  type,
  fields,
  onSuccess,
  onError,
  children,
  relatedIds,
}: RequestFormProps) {
  const router = useRouter();
  const { showToast } = useToast();
  const [formData, setFormData] = useState<Record<string, unknown>>(
    fields.reduce((acc, field) => ({ ...acc, [field.name]: '' }), {})
  );
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const handleInputChange = (name: string, value: unknown) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear field error when user starts typing
    if (fieldErrors[name]) {
      setFieldErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Guard against duplicate/accidental double submissions
    if (isSubmitting) return;

    setIsSubmitting(true);
    setErrorMessage('');
    setSuccessMessage('');
    setFieldErrors({});

    const response = await submitRequest(type, formData, relatedIds);

    if (response.success) {
      const message = response.message || 'درخواست با موفقیت ثبت شد';
      setSuccessMessage(message);
      showToast(message, 'success');
      setFormData(fields.reduce((acc, field) => ({ ...acc, [field.name]: '' }), {}));
      onSuccess?.();

      // Reset success message after 5 seconds
      setTimeout(() => setSuccessMessage(''), 5000);
      setIsSubmitting(false);
      return;
    }

    // Authentication was lost/expired between page load and submission -
    // send the user back through the authentication flow.
    if (response.status === 401) {
      showToast('برای ثبت درخواست ابتدا باید وارد حساب کاربری خود شوید', 'error');
      const returnTo = window.location.pathname + window.location.search;
      router.push(`/auth?redirect=${encodeURIComponent(returnTo)}`);
      setIsSubmitting(false);
      return;
    }

    const errors = parseFieldErrors(response.fieldErrors);
    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      showToast('لطفاً خطاهای فرم را برطرف کنید', 'error');
    } else {
      const message = response.error || 'خطای نامشخص';
      setErrorMessage(message);
      showToast(message, 'error');
      onError?.(message);
    }

    setIsSubmitting(false);
  };

  return (
    <div className="w-full max-w-2xl mx-auto bg-white rounded-2xl shadow-lg p-8">
      <div className="text-center mb-8">
        <h1 className="text-2xl font-bold text-brand-navy-dark mb-2">
          {REQUEST_TYPE_LABELS[type]}
        </h1>
        <p className="text-slate-600">لطفاً فرم زیر را پر کنید</p>
      </div>

      {successMessage && (
        <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
          <p className="text-sm text-green-700">{successMessage}</p>
        </div>
      )}

      {errorMessage && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-sm text-red-700">{errorMessage}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {children}

        {fields.map((field) => (
          <div key={field.name}>
            <label
              htmlFor={field.name}
              className="block text-sm font-medium text-slate-700 mb-2"
            >
              {field.label}
              {field.required && <span className="text-red-500 mr-1">*</span>}
            </label>

            {field.type === 'textarea' ? (
              <textarea
                id={field.name}
                placeholder={field.placeholder}
                value={(formData[field.name] as string) || ''}
                onChange={(e) => handleInputChange(field.name, e.target.value)}
                disabled={isSubmitting}
                maxLength={field.maxLength}
                required={field.required}
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-brand-navy focus:border-transparent outline-none disabled:bg-slate-100 resize-none ${
                  getFieldError(field.name, fieldErrors)
                    ? 'border-red-300 focus:ring-red-500'
                    : 'border-slate-300'
                }`}
                rows={5}
              />
            ) : field.type === 'select' ? (
              <select
                id={field.name}
                value={(formData[field.name] as string) || ''}
                onChange={(e) => handleInputChange(field.name, e.target.value)}
                disabled={isSubmitting}
                required={field.required}
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-brand-navy focus:border-transparent outline-none disabled:bg-slate-100 ${
                  getFieldError(field.name, fieldErrors)
                    ? 'border-red-300 focus:ring-red-500'
                    : 'border-slate-300'
                }`}
              >
                <option value="">انتخاب کنید...</option>
                {field.options?.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            ) : field.type === 'number' ? (
              <input
                id={field.name}
                type="number"
                placeholder={field.placeholder}
                value={(formData[field.name] as number) || ''}
                onChange={(e) => handleInputChange(field.name, e.target.value ? parseInt(e.target.value) : '')}
                disabled={isSubmitting}
                required={field.required}
                min={field.min}
                max={field.max}
                step={field.step}
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-brand-navy focus:border-transparent outline-none disabled:bg-slate-100 ${
                  getFieldError(field.name, fieldErrors)
                    ? 'border-red-300 focus:ring-red-500'
                    : 'border-slate-300'
                }`}
              />
            ) : (
              <input
                id={field.name}
                type={field.type}
                placeholder={field.placeholder}
                value={(formData[field.name] as string) || ''}
                onChange={(e) => handleInputChange(field.name, e.target.value)}
                disabled={isSubmitting}
                maxLength={field.maxLength}
                required={field.required}
                pattern={field.pattern}
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-brand-navy focus:border-transparent outline-none disabled:bg-slate-100 ${
                  getFieldError(field.name, fieldErrors)
                    ? 'border-red-300 focus:ring-red-500'
                    : 'border-slate-300'
                }`}
              />
            )}

            {getFieldError(field.name, fieldErrors) && (
              <p className="mt-1 text-sm text-red-600">{formatFieldError(getFieldError(field.name, fieldErrors))}</p>
            )}

            {field.helper && !getFieldError(field.name, fieldErrors) && (
              <p className="mt-1 text-xs text-slate-500">{field.helper}</p>
            )}
          </div>
        ))}

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-brand-navy text-white py-3 rounded-lg font-semibold hover:bg-brand-navy-dark disabled:bg-slate-300 disabled:cursor-not-allowed transition-colors"
        >
          {isSubmitting ? 'درحال ارسال...' : 'ارسال درخواست'}
        </button>
      </form>
    </div>
  );
}

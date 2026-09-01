import { z } from 'zod';

/**
 * Request type enum
 */
export enum RequestType {
  CONSULTATION = 'CONSULTATION',
  COOPERATION = 'COOPERATION',
  EQUIPMENT_RENTAL = 'EQUIPMENT_RENTAL',
  SPACE_RENTAL = 'SPACE_RENTAL',
  CONTACT = 'CONTACT',
  EVENT_PARTICIPATION = 'EVENT_PARTICIPATION',
  COURSE_PARTICIPATION = 'COURSE_PARTICIPATION',
}

/**
 * Request status enum
 */
export enum RequestStatus {
  NEW = 'NEW',
  IN_REVIEW = 'IN_REVIEW',
  CONTACTED = 'CONTACTED',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED',
  CLOSED = 'CLOSED',
}

/**
 * Persian request type labels for UI
 */
export const REQUEST_TYPE_LABELS: Record<RequestType, string> = {
  [RequestType.CONSULTATION]: 'درخواست مشاوره',
  [RequestType.COOPERATION]: 'درخواست همکاری',
  [RequestType.EQUIPMENT_RENTAL]: 'اجاره تجهیزات',
  [RequestType.SPACE_RENTAL]: 'اجاره فضا',
  [RequestType.CONTACT]: 'پیام تماس',
  [RequestType.EVENT_PARTICIPATION]: 'شرکت در رویداد',
  [RequestType.COURSE_PARTICIPATION]: 'ثبت‌نام دوره',
};

/**
 * Persian request status labels for UI
 */
export const REQUEST_STATUS_LABELS: Record<RequestStatus, string> = {
  [RequestStatus.NEW]: 'جدید',
  [RequestStatus.IN_REVIEW]: 'در بررسی',
  [RequestStatus.CONTACTED]: 'تماس گرفته شده',
  [RequestStatus.APPROVED]: 'تأیید شده',
  [RequestStatus.REJECTED]: 'رد شده',
  [RequestStatus.CLOSED]: 'بسته شده',
};

/**
 * Common base schema for all request payloads
 */
const baseRequestSchema = z.object({
  type: z.nativeEnum(RequestType),
});

/**
 * Consultation request schema
 */
export const consultationRequestSchema = baseRequestSchema.extend({
  type: z.literal(RequestType.CONSULTATION),
  subject: z.string().min(5, 'موضوع باید حداقل 5 کاراکتر باشد').max(100, 'موضوع نمی‌تواند بیش از 100 کاراکتر باشد'),
  description: z.string().min(10, 'توضیحات باید حداقل 10 کاراکتر باشد').max(2000, 'توضیحات نمی‌تواند بیش از 2000 کاراکتر باشد'),
});

export type ConsultationRequest = z.infer<typeof consultationRequestSchema>;

/**
 * Cooperation request schema
 */
export const cooperationRequestSchema = baseRequestSchema.extend({
  type: z.literal(RequestType.COOPERATION),
  cooperationArea: z.string().min(3, 'حوزه همکاری باید حداقل 3 کاراکتر باشد').max(100, 'حوزه همکاری نمی‌تواند بیش از 100 کاراکتر باشد'),
  shortIntroduction: z.string().min(10, 'معرفی کوتاه باید حداقل 10 کاراکتر باشد').max(300, 'معرفی کوتاه نمی‌تواند بیش از 300 کاراکتر باشد'),
  additionalDetails: z.string().max(2000, 'جزئیات اضافی نمی‌تواند بیش از 2000 کاراکتر باشد').optional().nullable(),
  portfolioUrl: z.string().url('آدرس درستی برای پورتفولیو وارد کنید').optional().nullable(),
});

export type CooperationRequest = z.infer<typeof cooperationRequestSchema>;

/**
 * Equipment rental request schema
 */
export const equipmentRentalRequestSchema = baseRequestSchema.extend({
  type: z.literal(RequestType.EQUIPMENT_RENTAL),
  projectType: z.string().min(3, 'نوع پروژه باید حداقل 3 کاراکتر باشد').max(100, 'نوع پروژه نمی‌تواند بیش از 100 کاراکتر باشد'),
  requiredEquipment: z.string().min(5, 'تجهیزات مورد نیاز باید حداقل 5 کاراکتر باشد').max(500, 'تجهیزات مورد نیاز نمی‌تواند بیش از 500 کاراکتر باشد'),
  requestedDate: z.string().refine((date) => !isNaN(Date.parse(date)), 'تاریخ درستی را انتخاب کنید'),
  rentalDuration: z.string().min(1, 'مدت زمان اجاره باید مشخص باشد').max(100, 'مدت زمان اجاره نمی‌تواند بیش از 100 کاراکتر باشد'),
  additionalNotes: z.string().max(1000, 'یادداشت‌های اضافی نمی‌تواند بیش از 1000 کاراکتر باشد').optional().nullable(),
});

export type EquipmentRentalRequest = z.infer<typeof equipmentRentalRequestSchema>;

/**
 * Space rental request schema
 */
export const spaceRentalRequestSchema = baseRequestSchema.extend({
  type: z.literal(RequestType.SPACE_RENTAL),
  requestedSpace: z.string().min(3, 'فضای مورد نیاز باید حداقل 3 کاراکتر باشد').max(100, 'فضای مورد نیاز نمی‌تواند بیش از 100 کاراکتر باشد'),
  requestedDate: z.string().refine((date) => !isNaN(Date.parse(date)), 'تاریخ درستی را انتخاب کنید'),
  startTime: z.string().regex(/^\d{2}:\d{2}$/, 'ساعت شروع را به فرمت HH:mm وارد کنید'),
  endTime: z.string().regex(/^\d{2}:\d{2}$/, 'ساعت پایان را به فرمت HH:mm وارد کنید'),
  numberOfPeople: z.number().min(1, 'تعداد افراد باید حداقل 1 باشد').max(200, 'تعداد افراد نمی‌تواند بیش از 200 نفر باشد'),
  intendedUse: z.string().min(5, 'کاربرد مورد نظر باید حداقل 5 کاراکتر باشد').max(500, 'کاربرد مورد نظر نمی‌تواند بیش از 500 کاراکتر باشد'),
  additionalNotes: z.string().max(1000, 'یادداشت‌های اضافی نمی‌تواند بیش از 1000 کاراکتر باشد').optional().nullable(),
}).refine(
  (data) => {
    const [startH, startM] = data.startTime.split(':').map(Number);
    const [endH, endM] = data.endTime.split(':').map(Number);
    const startMinutes = startH * 60 + startM;
    const endMinutes = endH * 60 + endM;
    return endMinutes > startMinutes;
  },
  {
    message: 'ساعت پایان باید بعد از ساعت شروع باشد',
    path: ['endTime'],
  }
);

export type SpaceRentalRequest = z.infer<typeof spaceRentalRequestSchema>;

/**
 * Contact request schema
 */
export const contactRequestSchema = baseRequestSchema.extend({
  type: z.literal(RequestType.CONTACT),
  subject: z.string().min(5, 'موضوع باید حداقل 5 کاراکتر باشد').max(100, 'موضوع نمی‌تواند بیش از 100 کاراکتر باشد'),
  message: z.string().min(10, 'پیام باید حداقل 10 کاراکتر باشد').max(2000, 'پیام نمی‌تواند بیش از 2000 کاراکتر باشد'),
});

export type ContactRequest = z.infer<typeof contactRequestSchema>;

/**
 * Event participation request schema
 */
export const eventParticipationRequestSchema = baseRequestSchema.extend({
  type: z.literal(RequestType.EVENT_PARTICIPATION),
  eventId: z.string().min(1, 'رویداد باید انتخاب شود'),
});

export type EventParticipationRequest = z.infer<typeof eventParticipationRequestSchema>;

/**
 * Course participation request schema
 */
export const courseParticipationRequestSchema = baseRequestSchema.extend({
  type: z.literal(RequestType.COURSE_PARTICIPATION),
  courseWorkshopId: z.string().min(1, 'دوره باید انتخاب شود'),
});

export type CourseParticipationRequest = z.infer<typeof courseParticipationRequestSchema>;

/**
 * Union type for all request payloads
 */
export type RequestPayload =
  | ConsultationRequest
  | CooperationRequest
  | EquipmentRentalRequest
  | SpaceRentalRequest
  | ContactRequest
  | EventParticipationRequest
  | CourseParticipationRequest;

/**
 * Master validation schema for all request types
 */
export const requestPayloadSchema = z.union([
  consultationRequestSchema,
  cooperationRequestSchema,
  equipmentRentalRequestSchema,
  spaceRentalRequestSchema,
  contactRequestSchema,
  eventParticipationRequestSchema,
  courseParticipationRequestSchema,
]);

/**
 * Request submission schema (for API)
 */
export const requestSubmissionSchema = z.object({
  type: z.nativeEnum(RequestType),
  payload: z.record(z.string(), z.unknown()),
  relatedCourseWorkshopId: z.string().optional().nullable(),
  relatedEventId: z.string().optional().nullable(),
});

export type RequestSubmission = z.infer<typeof requestSubmissionSchema>;

/**
 * Helper function to get validation schema for a specific request type
 */
export function getSchemaForRequestType(type: RequestType) {
  switch (type) {
    case RequestType.CONSULTATION:
      return consultationRequestSchema;
    case RequestType.COOPERATION:
      return cooperationRequestSchema;
    case RequestType.EQUIPMENT_RENTAL:
      return equipmentRentalRequestSchema;
    case RequestType.SPACE_RENTAL:
      return spaceRentalRequestSchema;
    case RequestType.CONTACT:
      return contactRequestSchema;
    case RequestType.EVENT_PARTICIPATION:
      return eventParticipationRequestSchema;
    case RequestType.COURSE_PARTICIPATION:
      return courseParticipationRequestSchema;
    default:
      throw new Error(`Unknown request type: ${type}`);
  }
}

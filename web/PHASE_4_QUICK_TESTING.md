# Phase 4: Request Forms - Quick Testing Guide

## Quick Start

1. **Ensure you're authenticated**
   - Visit http://localhost:3000/auth
   - Enter phone number (e.g., 09121234567)
   - Enter OTP code (get from Strapi admin panel)
   - Redirected to dashboard

2. **Test All Form Types**

### 1. Consultation Form
```
URL: http://localhost:3000/requests/consultation

Fields:
- Subject: "درخواست مشاوره فیلم کوتاه" (min 5, max 100)
- Description: "می‌خواهم درباره فیلم‌سازی کوتاه مشاوره بگیرم" (min 10, max 2000)

Expected: Success → Redirect to /dashboard/requests
```

### 2. Cooperation Form
```
URL: http://localhost:3000/requests/cooperation

Fields:
- Cooperation Area: "تهیه‌کندگی" (min 3, max 100)
- Short Introduction: "تجربه ۱۰ سال در تهیه‌کندگی فیلم" (min 10, max 300)
- Additional Details: "علاقه دارم در پروژه‌های اسلامی فعالیت کنم" (optional, max 2000)
- Portfolio URL: "https://example.com/portfolio" (optional, must be valid)

Expected: Success → Redirect to /dashboard/requests
```

### 3. Equipment Rental
```
URL: http://localhost:3000/requests/equipment

Fields:
- Project Type: "فیلم کوتاه" (min 3, max 100)
- Required Equipment: "دوربین 4K، لنز، نورپردازی" (min 5, max 500)
- Requested Date: [pick any future date]
- Rental Duration: "۳ روز" (min 1, max 100)
- Additional Notes: "دارای تجهیز نقل و انتقال" (optional, max 1000)

Expected: Success → Redirect to /dashboard/requests
```

### 4. Space Rental
```
URL: http://localhost:3000/requests/space

Fields:
- Requested Space: [select: "سالن آموزش"]
- Requested Date: [pick any future date]
- Start Time: "14:00" (HH:mm format)
- End Time: "18:00" (must be after start time)
- Number of People: 25 (1-200)
- Intended Use: "جلسه کاری تیم فیلم‌سازی" (min 5, max 500)
- Additional Notes: "نیاز به تجهیزات مالتی‌مدیا" (optional, max 1000)

Expected: Success → Redirect to /dashboard/requests
```

### 5. Contact Form (No Auth Required)
```
URL: http://localhost:3000/requests/contact

Fields:
- Subject: "سؤال درباره دوره‌ها" (min 5, max 100)
- Message: "آیا کلاس‌های آنلاین هم وجود دارد؟" (min 10, max 2000)

Expected: Success (even without login) → Redirect to /dashboard/requests
```

### 6. Course Participation
```
URL: http://localhost:3000/requests/course?courseId=<course-id>&courseName=دوره%20بازیگری

Steps:
1. Get valid course ID from /api/courses or course detail page
2. Click "ثبت‌نام" button on course page (or visit URL directly)
3. Review course name shown on form
4. Click "ارسال درخواست"

Expected: Success → Redirect to /dashboard/courses
```

### 7. Event Participation
```
URL: http://localhost:3000/requests/event?eventId=<event-id>&eventName=نمایش%20فیلم

Steps:
1. Get valid event ID from /api/events or event detail page
2. Click "شرکت در رویداد" button (or visit URL directly)
3. Review event name shown on form
4. Click "ارسال درخواست"

Expected: Success → Redirect to /dashboard/courses
```

## Validation Testing

### Should Succeed ✓
```
POST /api/requests/submit
{
  "type": "CONSULTATION",
  "payload": {
    "subject": "موضوع درخواست",
    "description": "این یک توضیح کامل درباره درخواستم است"
  }
}
→ 201 Created
```

### Should Fail - Too Short (400)
```
POST /api/requests/submit
{
  "type": "CONSULTATION",
  "payload": {
    "subject": "کوتاه",
    "description": "توضیح"
  }
}
→ 400 Bad Request
{
  "fieldErrors": {
    "subject": "موضوع باید حداقل 5 کاراکتر باشد",
    "description": "توضیحات باید حداقل 10 کاراکتر باشد"
  }
}
```

### Should Fail - Duplicate (409)
```
POST /api/requests/submit
{
  "type": "COURSE_PARTICIPATION",
  "payload": {
    "courseWorkshopId": "same-course-id"
  },
  "relatedCourseWorkshopId": "same-course-id"
}

If user already has request for this course:
→ 409 Conflict
{
  "error": "شما قبلاً برای این مورد یک درخواست ثبت کرده‌اید"
}
```

### Should Fail - Unauthenticated (401) for most forms
```
POST /api/requests/submit
(no auth-token cookie)

For non-contact forms:
→ 401 Unauthorized
```

## Dashboard Verification

After submitting forms:

1. **Visit Dashboard**
   - http://localhost:3000/dashboard
   - Should show stats updated with new requests
   - Should show recent request cards

2. **View Requests List**
   - http://localhost:3000/dashboard/requests
   - Should list all submitted requests
   - Status should be "جدید" (NEW)
   - Type should match form type
   - Submission date should be recent

3. **View Request Detail**
   - Click on any request
   - Should show submitted data
   - Should show status and timeline
   - Should show option to contact institute

## Error Scenarios to Test

### Field Validation
- [ ] Try submitting with empty fields
- [ ] Try exceeding max length limits
- [ ] Try submitting end time before start time (space rental)
- [ ] Try submitting invalid URL (cooperation)
- [ ] Try submitting past date (equipment rental)

### Duplicate Prevention
- [ ] Submit course participation twice
- [ ] Submit event participation twice
- [ ] Duplicate consultation should still be allowed (not duplicate-checked)

### Error Messages
- [ ] Check all error messages are in Persian
- [ ] Check field errors align with fields
- [ ] Check error messages are specific and actionable

### Form State
- [ ] Form resets after successful submission
- [ ] Form retains data if validation fails
- [ ] Field errors clear when user starts typing
- [ ] Submit button disabled during submission

## Network Testing

### Test in DevTools Network Tab
```
POST /api/requests/submit
- Status: 201 Created (on success)
- Response: includes requestId
- Headers: Authorization bearer token should NOT be exposed
```

### Test with Invalid Token
```
Cookie: auth-token=invalid-token
→ 401 Unauthorized
```

## Accessibility Checklist

- [ ] All labels properly associated with inputs
- [ ] Tab navigation works through form
- [ ] Error messages announce with aria-live
- [ ] Helper text visible under each field
- [ ] Focus visible on all interactive elements
- [ ] RTL layout doesn't break on keyboard nav

## Performance Checklist

- [ ] Form submits in < 2 seconds
- [ ] No console errors during submission
- [ ] No infinite loops or network requests
- [ ] Success message auto-dismisses in 5 seconds
- [ ] Form responsive on mobile (< 600px)
- [ ] No layout shift on error message

## Next Steps

After verifying all forms work:

1. **Phase 5 Preparation**
   - Admin panel will manage these requests
   - Admin can change status, add responses
   - Users see responses in request detail

2. **Email Integration**
   - Send confirmation emails to users
   - Send notifications to admin

3. **Analytics**
   - Track submission rates by type
   - Track conversion funnel

---

**Last Updated**: 2026-09-02  
**Tested**: Build passing, all routes dynamic  
**Status**: Ready for Phase 5 (Admin Management)

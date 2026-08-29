# DESIGN.md
# Tehrani Free Cinema Institute — Technical & System Design

> **Document status:** Implementation baseline  
> **Version:** 1.0  
> **Source of truth:** `PRD.md` for product scope and acceptance criteria  
> **Companion document:** `README.md` for repository/project overview

---

## 1. Purpose

This document translates the approved product requirements into an implementation-oriented technical design.

It defines:

- application architecture
- technology decisions and recommendations
- frontend architecture
- CMS/content architecture
- authentication and authorization
- request-management architecture
- domain model and relationships
- API boundaries
- caching and rendering strategy
- SEO architecture
- security requirements
- accessibility and RTL rules
- testing strategy
- observability and deployment expectations
- repository conventions
- development phases and engineering standards

This document does **not** expand the v1 product scope. Features explicitly listed as out of scope in `PRD.md` must not be introduced without a scope change.

---

## 2. Product Constraints

The implementation must preserve these core constraints from the PRD:

1. The website is Persian-only in v1.
2. The entire public experience is RTL-first.
3. Next.js is the frontend framework.
4. The product is a content + registration-request + lead-management + support platform.
5. v1 is **not** an e-commerce platform.
6. There is no cart, checkout, payment gateway, invoice system, or online payment.
7. Course/event capacity is controlled manually by staff.
8. Submitted requests do not automatically reduce remaining capacity.
9. Participation requests must prevent duplicates.
10. Course/workshop/event archive state is derived from the end date.
11. Users authenticate through mobile number + SMS OTP.
12. Iranian national ID must be format- and checksum-validated.
13. Mobile number and national ID are private data.
14. Request Admin must have restricted operational access.
15. Super Admin controls content, settings, users, requests, SEO, categories, tags, and permissions.
16. All primary static content must be manageable without changing source code.
17. Global search must cover the required content domains.
18. Technical SEO is part of v1; ongoing SEO operations are not.
19. The user panel is intentionally simple.
20. Real-time chat is not required.
21. SMS is required for OTP only in v1.
22. The architecture should remain extensible without introducing unnecessary v1 complexity.

---

# 3. Recommended Technology Architecture

The PRD leaves CMS, database, SMS provider, storage/CDN, and hosting as TBD. The following is the recommended implementation because it aligns well with the product's content-heavy model and the existing Next.js requirement.

## 3.1 Recommended stack

| Layer | Recommendation | Reason |
|---|---|---|
| Frontend | Next.js App Router + TypeScript | SEO, SSR/SSG, routing, server actions/API boundaries, performance |
| UI | React + Tailwind CSS or equivalent design-token based system | Fast component development and consistent responsive RTL styling |
| CMS / Backend | Strapi v5 | Headless content management, relations, roles, media, draft/publish, flexible content |
| Database | PostgreSQL | Strong relational support for content relationships and request workflows |
| Authentication | Application-owned OTP/session layer | Keeps the authentication flow independent from CMS assumptions |
| SMS | Provider adapter | Allows SMS provider replacement without redesigning auth |
| Media | Object storage + CDN | Appropriate for image/audio/video-heavy content |
| Search | Start with database-backed search; introduce dedicated search engine only when scale requires it | Avoids premature infrastructure complexity |
| Validation | Zod or equivalent shared schema library | Shared client/server validation |
| Testing | Vitest/Jest + React Testing Library + Playwright | Unit, component, and end-to-end coverage |
| Monitoring | Error monitoring + structured application logs | Production visibility |
| Package manager | Repository-defined choice, preferably pnpm | Good monorepo/dependency management if CMS/app are colocated |

### Important

The CMS/database choice above is a **technical recommendation**, not a change to the PRD. The implementation team may use another solution if it satisfies all PRD requirements.

---

# 4. System Architecture

## 4.1 Logical architecture

```text
                         ┌─────────────────────────┐
                         │       End User          │
                         │ Browser / Mobile Web     │
                         └────────────┬────────────┘
                                      │
                                      ▼
                         ┌─────────────────────────┐
                         │       Next.js App       │
                         │                         │
                         │ Public Website          │
                         │ Authenticated Panel     │
                         │ API / Server Actions    │
                         │ SEO / Metadata          │
                         └────────────┬────────────┘
                                      │
                    ┌─────────────────┼─────────────────┐
                    │                 │                 │
                    ▼                 ▼                 ▼
             ┌────────────┐   ┌──────────────┐   ┌──────────────┐
             │ CMS / Admin│   │ Application  │   │ Media Layer  │
             │ Content    │   │ Services     │   │ Storage/CDN  │
             │ Taxonomies │   │ Auth/Requests│   │              │
             └──────┬─────┘   └──────┬───────┘   └──────────────┘
                    │                │
                    └────────┬───────┘
                             ▼
                     ┌──────────────┐
                     │ PostgreSQL   │
                     │              │
                     │ Content      │
                     │ Users        │
                     │ Requests     │
                     │ Responses    │
                     └──────────────┘

                              │
                              ▼
                       ┌────────────┐
                       │ SMS Adapter│
                       │ OTP Provider│
                       └────────────┘
```

## 4.2 Architectural rule

Keep four responsibilities separate:

1. **Presentation** — Next.js UI.
2. **Content management** — CMS.
3. **Application/domain logic** — authentication, requests, participation rules, authorization, and business validation.
4. **Infrastructure** — database, storage, SMS, caching, deployment, logging.

The frontend must not contain authoritative business rules.

For example:

- duplicate-request prevention must be enforced server-side
- capacity state must be validated server-side
- request permissions must be validated server-side
- national ID validation must run server-side
- private user data must never rely on frontend filtering for protection

---

# 5. Repository Architecture

## 5.1 Recommended structure

A single repository is preferred initially unless CMS infrastructure is managed completely separately.

```text
.
├── app/
│   ├── (site)/
│   │   ├── page.tsx
│   │   ├── about/
│   │   ├── founder/
│   │   ├── instructors/
│   │   ├── courses/
│   │   ├── workshops/
│   │   ├── events/
│   │   ├── archive/
│   │   ├── daneshnameh/
│   │   ├── media/
│   │   ├── rental/
│   │   └── contact/
│   │
│   ├── (auth)/
│   │   ├── login/
│   │   ├── register/
│   │   └── otp/
│   │
│   ├── panel/
│   │   ├── page.tsx
│   │   ├── profile/
│   │   ├── requests/
│   │   ├── courses/
│   │   ├── events/
│   │   └── responses/
│   │
│   ├── search/
│   ├── api/
│   │   ├── auth/
│   │   ├── requests/
│   │   ├── search/
│   │   └── ...
│   ├── sitemap.ts
│   ├── robots.ts
│   ├── layout.tsx
│   ├── not-found.tsx
│   └── error.tsx
│
├── components/
│   ├── ui/
│   ├── layout/
│   ├── forms/
│   ├── content/
│   ├── media/
│   ├── navigation/
│   └── feedback/
│
├── features/
│   ├── auth/
│   ├── users/
│   ├── requests/
│   ├── courses/
│   ├── events/
│   ├── instructors/
│   ├── media/
│   ├── articles/
│   └── search/
│
├── lib/
│   ├── auth/
│   ├── cms/
│   ├── db/
│   ├── sms/
│   ├── storage/
│   ├── search/
│   ├── validation/
│   ├── seo/
│   ├── security/
│   └── utils/
│
├── hooks/
├── types/
├── config/
├── public/
├── styles/
├── tests/
│   ├── unit/
│   ├── integration/
│   └── e2e/
│
├── docs/
├── PRD.md
├── README.md
├── DESIGN.md
├── .env.example
├── package.json
└── ...
```

### Folder responsibilities

- `app/`: routing, layouts, page composition, route handlers.
- `components/ui/`: reusable visual primitives with no domain assumptions.
- `components/content/`: reusable content presentation components.
- `features/`: domain-specific UI and orchestration.
- `lib/`: infrastructure, integrations, domain helpers, validation.
- `types/`: shared TypeScript types.
- `tests/`: automated tests.
- `config/`: application-wide configuration.
- `docs/`: architecture and operational documentation.

Avoid putting business logic directly inside React components.

---

# 6. Frontend Architecture

## 6.1 Rendering strategy

Use Next.js App Router with a deliberate mix of server and client components.

### Prefer Server Components for:

- public content pages
- article detail pages
- course/event detail pages
- instructor detail pages
- founder/about pages
- SEO-sensitive listings
- content fetching
- metadata generation

### Use Client Components for:

- interactive filters
- dialogs
- OTP input
- form state
- media player controls
- carousels
- tabs where interaction is required
- dynamic request forms
- authenticated dashboard interactions

The default should be server-first. Do not mark large page trees as `"use client"` without a clear reason.

---

# 7. Design System

The design system should be established before building pages independently.

## 7.1 Core principles

- RTL-first
- Persian typography
- mobile-first responsive behavior
- consistent spacing scale
- semantic color tokens
- reusable typography scale
- accessible interaction states
- no page-specific visual primitives when a reusable component is appropriate

## 7.2 Required UI primitives

At minimum:

- Button
- IconButton
- Input
- PhoneInput
- OTPInput
- NationalIdInput
- Textarea
- Select
- Checkbox
- Radio
- FormField
- FormError
- Dialog
- Drawer
- Sheet
- Tabs
- Breadcrumb
- Pagination
- Card
- Badge
- StatusBadge
- EmptyState
- ErrorState
- Skeleton
- Toast/notification
- Dropdown
- Modal confirmation
- MediaCard
- CourseCard
- EventCard
- InstructorCard
- ArticleCard
- SearchInput

## 7.3 RTL requirements

Do not implement layout logic by assuming left/right semantics.

Prefer logical CSS properties:

```css
margin-inline
padding-inline
inset-inline-start
inset-inline-end
border-inline
text-align: start
```

Avoid unnecessary hard-coded:

```css
margin-left
margin-right
left
right
```

unless the direction is genuinely physical rather than logical.

All icons must be reviewed for directional meaning.

---

# 8. Public Information Architecture

The public site should follow the PRD navigation structure:

```text
Home
About Us
Ali Azimzadeh Tehrani
Instructors & Team
Events
Courses & Workshops
دانش‌نامه
Media Library
Rental Services
Contact Us
```

Global header actions:

```text
Search
Sign In / Register
User Panel (authenticated)
```

The final visual navigation may use dropdowns on desktop and a drawer/menu on mobile.

---

# 9. Page Architecture

## 9.1 Homepage

Recommended composition:

```text
Header
↓
Hero
↓
Institute Introduction
↓
Current Courses / Workshops
↓
Upcoming Events
↓
Instructors / Team
↓
Founder
↓
دانش‌نامه
↓
Media Library
↓
Rental Services
↓
Contact / Consultation CTA
↓
Footer
```

Do not hard-code content into the page.

The CMS should control:

- headlines
- descriptions
- CTA labels
- CTA targets
- images/video
- selected courses/events/articles/media
- ordering
- visibility where practical

---

# 10. Content Architecture

## 10.1 Content types

The minimum content model should include:

```text
SiteSettings
StaticPage
FounderPage
InstructorProfile
InstructorCategory
CourseWorkshop
CourseSession
Event
EventCategory
Article
ArticleCategory
ArticleTag
MediaItem
MediaTag
RentalPage
ContactPage
```

## 10.2 Shared SEO component

All SEO-enabled content types should use a consistent SEO model.

Recommended conceptual structure:

```text
SEO
├── metaTitle
├── metaDescription
├── canonicalUrl
├── ogTitle
├── ogDescription
├── ogImage
├── noIndex
└── noFollow
```

The implementation may represent this as a CMS component/shared object.

Do not duplicate SEO logic in every frontend page.

---

# 11. Domain Model

## 11.1 User

```text
User
- id
- fullName
- mobile
- mobileVerifiedAt
- nationalIdEncrypted / protected representation
- nationalIdHash (for uniqueness/search logic where required)
- createdAt
- updatedAt
- status
```

### Security note

The exact storage strategy for national ID should be finalized with the chosen authentication/database architecture.

Do not expose the national ID through public APIs.

---

## 11.2 Instructor

```text
Instructor
- id
- name
- slug
- image
- title
- category
- biography
- resume
- teachingExperience
- professionalExperience
- achievements
- socialLinks
- media
- seo
- publicationStatus
```

Relationship:

```text
Instructor ↔ CourseWorkshop
```

A many-to-many relationship is preferred because a course/workshop may have multiple instructors and an instructor may teach multiple courses/workshops.

---

## 11.3 Instructor Category

Dynamic taxonomy.

```text
InstructorCategory
- id
- name
- slug
- description
```

Never hard-code category values in frontend business logic.

---

# 12. Course / Workshop Model

```text
CourseWorkshop
- id
- title
- slug
- type: COURSE | WORKSHOP
- mainImage
- media
- shortDescription
- fullDescription
- instructors[]
- startDate
- endDate
- sessions[]
- venue
- totalCapacity
- remainingCapacity
- isFull
- price
- publicationStatus
- seo
- createdAt
- updatedAt
```

## 12.1 Sessions

```text
CourseSession
- id
- courseWorkshopId
- title / sessionNumber
- date
- startTime
- endTime
```

## 12.2 Archive rule

Archive state is derived:

```text
archived = endDate < currentDate
```

Do not maintain a duplicated `archived` boolean unless there is a strong infrastructure reason.

The public detail page remains accessible after archival.

Participation must be rejected for archived content.

---

# 13. Event Model

```text
Event
- id
- title
- slug
- category
- image
- shortDescription
- fullDescription
- date
- time
- venue
- totalCapacity
- remainingCapacity
- isFull
- price
- media
- publicationStatus
- seo
```

Archive rule:

```text
event.dateTime < currentDateTime
```

If the product owner defines archive based only on date rather than date/time, implement the exact finalized business rule consistently.

---

# 14. Article / دانش‌نامه Model

```text
Article
- id
- title
- slug
- featuredImage
- summary
- content
- category
- tags[]
- publicationDate
- publicationStatus
- seo
```

The public frontend must not display an author.

Comments are excluded from v1.

---

# 15. Media Library Model

The Media Library must be a first-class content domain.

```text
MediaItem
- id
- title
- slug
- description
- mediaType
- cover
- sourceMode
- sourceUrl
- uploadedAsset
- tags[]
- publicationStatus
- publicationDate
```

Recommended enums:

```text
mediaType:
- VIDEO
- AUDIO
- IMAGE
- INTERVIEW
- EDUCATIONAL
- OTHER
```

```text
sourceMode:
- UPLOAD
- EXTERNAL_URL
```

The UI should choose the appropriate playback/rendering strategy based on media type and source.

---

# 16. Rental Services Model

Rental is a service content domain, not an e-commerce catalog.

Do not model equipment as products in v1.

Recommended model:

```text
RentalPage
- introduction
- equipmentRentalDescription
- spaceRentalDescription
- trainingHall
- contentProductionStudio
- directCallCTA
- seo
```

Known space:

```text
Training Hall
Capacity: 40
```

Content and imagery must be CMS-managed.

---

# 17. Request Management Domain

This is a core application domain and should be separated from generic content models.

## 17.1 Request

```text
Request
- id
- userId
- type
- status
- submittedAt
- relatedCourseWorkshopId?
- relatedEventId?
- payload
- internalNotes?
- closedAt?
- updatedAt
```

### Request types

```text
CONSULTATION
COOPERATION
EQUIPMENT_RENTAL
SPACE_RENTAL
CONTACT
EVENT_PARTICIPATION
COURSE_PARTICIPATION
```

### Statuses

```text
NEW
IN_REVIEW
CONTACTED
APPROVED
REJECTED
CLOSED
```

The UI should expose Persian labels, while the backend uses stable enum values.

---

# 18. Request Payload Strategy

The request domain has seven different forms.

Use a controlled schema approach instead of one giant untyped JSON form.

Recommended conceptual design:

```text
Request
├── common metadata
└── type-specific payload
```

Example:

```ts
type RequestPayload =
  | ConsultationRequestPayload
  | CooperationRequestPayload
  | EquipmentRentalRequestPayload
  | SpaceRentalRequestPayload
  | ContactRequestPayload
  | EventParticipationRequestPayload
  | CourseParticipationRequestPayload;
```

Each payload must have its own runtime validation schema.

This gives flexibility without allowing arbitrary unsafe data.

---

# 19. Request Form Schemas

## 19.1 Consultation

```text
subject
description
```

Identity is taken from the authenticated account.

## 19.2 Cooperation

```text
cooperationArea
shortIntroduction
additionalDetails
portfolioUrl? 
```

## 19.3 Equipment Rental

```text
projectType
requiredEquipment
requestedDate
rentalDuration
additionalNotes
```

## 19.4 Space Rental

```text
requestedSpace
requestedDate
startTime
endTime
numberOfPeople
intendedUse
additionalNotes
```

## 19.5 Contact

```text
subject
message
```

## 19.6 Event Participation

```text
eventId
```

Additional fields should only be introduced if approved by product requirements.

## 19.7 Course/Workshop Participation

```text
courseWorkshopId
```

Additional fields should only be introduced if approved by product requirements.

---

# 20. Duplicate Participation Prevention

This rule must be enforced at the application/database level.

Frontend-only prevention is insufficient.

Recommended invariant:

```text
A user can have at most one active/submitted participation request
for the same course/workshop or event.
```

The exact uniqueness constraint should be implemented with a database-level unique constraint where supported, or an equivalent transactional mechanism.

Example conceptual uniqueness:

```text
UNIQUE(userId, courseWorkshopId, requestType)
```

and

```text
UNIQUE(userId, eventId, requestType)
```

Do not depend on:

```text
if (frontendAlreadySubmitted) ...
```

---

# 21. Capacity Management

Capacity is manually controlled.

Fields:

```text
totalCapacity
remainingCapacity
isFull
```

Rules:

1. Submission does not automatically reduce remaining capacity.
2. Request Admin can edit remaining capacity.
3. Request Admin can toggle `isFull`.
4. `isFull === true` disables participation CTAs.
5. Archived items cannot accept participation requests.
6. A successful request does not imply enrollment confirmation.

The backend must re-check the capacity state at request creation time.

---

# 22. Authentication Architecture

## 22.1 Registration flow

```text
Enter full name
       ↓
Enter mobile
       ↓
Enter Iranian national ID
       ↓
Validate input
       ↓
Send OTP
       ↓
User enters OTP
       ↓
Server verifies OTP
       ↓
Create/activate account
       ↓
Create authenticated session
       ↓
Redirect to intended destination
```

## 22.2 Login flow

```text
Enter mobile
       ↓
Send OTP
       ↓
Verify OTP
       ↓
Create session
       ↓
Redirect
```

## 22.3 OTP security

Implement:

- expiration
- resend cooldown
- request rate limiting
- verification attempt limits
- abuse protection
- server-side verification
- provider abstraction
- secure storage of temporary OTP state
- generic error messages that do not leak sensitive account information

Never store plaintext production OTPs in application logs.

---

# 23. SMS Provider Abstraction

Use an adapter interface.

```ts
interface SmsProvider {
  sendOtp(input: {
    mobile: string;
    code: string;
  }): Promise<void>;
}
```

Possible implementation:

```text
sms/
├── provider.ts
├── factory.ts
├── providers/
│   ├── provider-a.ts
│   └── provider-b.ts
└── templates.ts
```

The selected provider remains TBD.

Changing the provider must not require rewriting authentication business logic.

---

# 24. Session and Authorization Model

Use secure server-managed authentication.

Recommended principles:

- HTTP-only session cookie
- `Secure` in production
- appropriate `SameSite`
- expiration/rotation strategy
- server-side session validation
- authorization checks on every privileged action

Roles:

```text
PUBLIC
USER
REQUEST_ADMIN
SUPER_ADMIN
```

Do not rely solely on route visibility in the frontend.

Every privileged API/server action must enforce authorization independently.

---

# 25. Authorization Matrix

| Capability | Public | User | Request Admin | Super Admin |
|---|---:|---:|---:|---:|
| Browse public content | ✅ | ✅ | ✅ | ✅ |
| Search public content | ✅ | ✅ | ✅ | ✅ |
| Register/sign in | ✅ | ✅ | ✅ | ✅ |
| Submit own requests | ❌ | ✅ | depends | depends |
| View own requests | ❌ | ✅ | ❌ | ✅ |
| View private user data | ❌ | own only | ✅ required data | ✅ |
| Change request status | ❌ | ❌ | ✅ | ✅ |
| Add request response | ❌ | ❌ | ✅ | ✅ |
| Manage capacity | ❌ | ❌ | ✅ | ✅ |
| Manage content | ❌ | ❌ | ❌ by default | ✅ |
| Manage site settings | ❌ | ❌ | ❌ | ✅ |
| Manage users | ❌ | ❌ | limited if approved | ✅ |
| Manage roles/permissions | ❌ | ❌ | ❌ | ✅ |

The Request Admin role must not inherit unrestricted CMS/site-settings access.

---

# 26. User Panel Architecture

Keep the panel lightweight.

```text
/panel
/panel/profile
/panel/requests
/panel/requests/[id]
/panel/courses
/panel/events
/panel/responses
```

## Dashboard

Show:

- recent requests
- current statuses
- recent institute responses
- useful quick actions

Avoid complex charts and analytics.

## Request detail

Show:

```text
Request ID
Request type
Submission date
Submitted information
Current status
Institute responses
Direct-call CTA
```

Users must only be able to access their own private request records.

---

# 27. Request Admin Interface

The Request Admin interface should be operationally optimized rather than visually complex.

## Request list

Required filters:

- type
- status
- submission date
- user name
- mobile
- related course/event

Required actions:

- open request
- change status
- view relevant user data
- initiate phone call
- submit response
- close request
- add internal note where supported

Prioritize rapid scanning and short interaction paths.

---

# 28. Response Model

Use a one-to-many response model.

```text
Request
  └── AdminResponse[]
```

Recommended:

```text
AdminResponse
- id
- requestId
- authorId
- message
- createdAt
- visibility
```

For v1, responses are internal-to-user-panel messages only.

Do not implement real-time messaging.

---

# 29. API / Backend Boundaries

Public content queries may be read through the CMS API or an application-level content service.

Authenticated operations should preferably pass through a controlled application service.

Conceptual boundaries:

```text
GET  /content/...
GET  /search
POST /auth/send-otp
POST /auth/verify-otp
POST /requests
GET  /requests
GET  /requests/:id
POST /requests/:id/responses      [admin]
PATCH /requests/:id/status        [admin]
PATCH /courses/:id/capacity       [admin]
```

The exact route layout is implementation-specific.

### Principle

Do not expose raw CMS endpoints directly to the browser when doing so would leak private data or bypass domain authorization.

---

# 30. Service Layer

Application logic should be organized around use cases.

Recommended:

```text
features/requests/server/
├── create-request.ts
├── get-user-requests.ts
├── get-request-by-id.ts
├── update-request-status.ts
├── add-request-response.ts
└── update-capacity.ts
```

Each use case should:

1. authenticate/authorize
2. validate input
3. load relevant domain data
4. enforce business rules
5. perform the mutation
6. return a safe response

---

# 31. Validation Architecture

Use shared runtime schemas.

Recommended structure:

```text
lib/validation/
├── auth.ts
├── user.ts
├── consultation.ts
├── cooperation.ts
├── equipment-rental.ts
├── space-rental.ts
├── contact.ts
├── event-participation.ts
└── course-participation.ts
```

Client-side validation improves UX.

Server-side validation is authoritative.

Never trust client validation.

---

# 32. Iranian Mobile Validation

Normalize phone numbers before validation/storage.

The implementation should define one canonical representation.

Example policy:

```text
09xxxxxxxxx
```

may be normalized to:

```text
+989xxxxxxxxx
```

or another single internal representation.

The important requirement is consistency across:

- account lookup
- OTP
- duplicate user detection
- admin search
- `tel:` links
- SMS provider integration

Do not allow multiple representations to create duplicate accounts.

---

# 33. Iranian National ID Validation

National ID must support:

- input format validation
- checksum validation
- server-side validation

Do not treat client-side checksum validation as sufficient.

The national ID must never be exposed in public content, search, URL parameters, analytics payloads, or error messages.

---

# 34. Search Architecture

## Initial implementation

Start with a server-side search service over the supported content domains:

```text
Articles
Instructors
Courses
Workshops
Events
Media
```

Search fields should prioritize:

- title
- slug where useful
- summary
- descriptions/content
- relevant taxonomy labels

Return:

```text
type
title
slug
thumbnail
excerpt
url
```

Never return private user information.

## Scaling path

If search volume or content scale justifies it later:

```text
Database Search
      ↓
Dedicated Search Index
```

Potential future options include Elasticsearch/OpenSearch/Meilisearch/Typesense, but this should not be added to v1 without a real need.

---

# 35. Caching and Data Freshness

## Public content

Use ISR/revalidation where practical.

Good candidates:

- homepage
- about
- founder
- instructor pages
- course pages
- event pages
- article pages
- media pages

## Immediately mutable data

Requests and user-specific information must not use unsafe public caching.

Examples:

- `/panel/*`
- request status
- request responses
- profile information
- OTP/session endpoints
- Request Admin operations

## Cache invalidation

When content changes in CMS:

```text
CMS mutation
    ↓
Revalidation signal/webhook
    ↓
Next.js cache invalidation
    ↓
Updated public page
```

Use targeted invalidation instead of globally disabling caching.

---

# 36. SEO Architecture

Implement:

- semantic HTML
- canonical URLs
- dynamic metadata
- Open Graph
- sitemap
- robots
- correct heading hierarchy
- alt text
- clean slugs
- indexable public detail pages
- internal links

Use Next.js metadata APIs.

Recommended dynamic metadata pattern:

```ts
export async function generateMetadata({
  params,
}: Props) {
  const content = await getContent(params.slug);

  return {
    title: content.seo?.metaTitle ?? content.title,
    description: content.seo?.metaDescription ?? content.summary,
    alternates: {
      canonical: content.seo?.canonicalUrl ?? content.url,
    },
  };
}
```

This is a conceptual pattern; adapt to the final data layer.

---

# 37. Structured Data

Use schema markup only where the actual content supports it.

Potential candidates:

- Organization
- Article
- Event
- BreadcrumbList

Do not fabricate fields merely to obtain richer search results.

Structured data must represent the visible page content accurately.

---

# 38. Media Architecture

Media requires special attention because the product includes video/audio content.

## 38.1 Images

Use:

- Next.js image optimization
- responsive sizes
- lazy loading where appropriate
- meaningful alt text
- controlled dimensions to reduce layout shift

## 38.2 Video/audio

Use a reusable media-player abstraction.

```text
MediaPlayer
├── VideoPlayer
├── AudioPlayer
├── ExternalEmbed
└── UnsupportedSourceFallback
```

The player must support:

- play/pause
- seek
- volume
- fullscreen for video
- responsive layout

## 38.3 External media

External URLs should be validated and rendered using safe allowlisted/embed strategies.

Do not blindly inject arbitrary iframe URLs.

---

# 39. Upload Security

All uploads require:

- file type validation
- file size validation
- safe storage naming
- authorization checks
- content-type verification where possible
- safe public URL generation
- protection against executable uploads

Do not use original filenames as trusted storage paths.

---

# 40. Error Handling

Required frontend states:

```text
Loading
Empty
Validation Error
Unauthorized
Forbidden
Not Found
Conflict
Server Error
Network Error
```

Create reusable components:

```text
LoadingState
EmptyState
ErrorState
NotFoundState
UnauthorizedState
ForbiddenState
```

### Business conflicts

Examples:

- duplicate participation
- full capacity
- archived event/course
- invalid request state

These should return structured, user-safe errors that the UI can map to Persian messages.

---

# 41. URL and Slug Strategy

Every dynamic public content item must have a stable URL.

Recommended patterns:

```text
/instructors/[slug]
/courses/[slug]
/workshops/[slug]
/events/[slug]
/daneshnameh/[slug]
/media/[slug]
```

If courses and workshops share one content type, a shared route is also acceptable:

```text
/courses/[slug]
```

The selected URL strategy should be consistent throughout the application.

Slugs must be unique within the relevant content namespace.

---

# 42. Archive Architecture

Archive pages should be derived from content dates.

Recommended:

```text
/archive?type=event
/archive?type=course
/archive?type=workshop
```

Sort archived content by most recently completed item first.

Do not create unnecessary duplicated archive records.

---

# 43. Pagination

Use pagination or progressive loading for large collections.

Required candidates:

- articles
- media
- instructors
- courses
- workshops
- events
- archive

Prefer server-side pagination for SEO-friendly public listing pages.

---

# 44. Accessibility

Baseline requirements:

- semantic HTML
- associated form labels
- keyboard-accessible controls
- visible focus states
- accessible dialog behavior
- sufficient text contrast
- alt text for meaningful images
- proper heading hierarchy
- no keyboard traps
- meaningful error messages
- accessible status indicators

RTL must not break focus order or semantic structure.

---

# 45. Performance Budget

The application is content/media heavy, so performance is a first-class requirement.

Priorities:

1. Avoid unnecessary client-side JavaScript.
2. Optimize images.
3. Lazy-load below-the-fold media.
4. Prevent layout shifts.
5. Use server rendering for SEO-sensitive content.
6. Cache public content.
7. Split large interactive components.
8. Optimize fonts.
9. Avoid unnecessary third-party scripts.
10. Do not autoplay heavy media by default without a deliberate UX reason.

Performance should be evaluated using:

- Core Web Vitals
- Lighthouse
- real-device mobile checks

No absolute performance number is defined in the PRD, so final budgets should be agreed during implementation rather than invented as acceptance criteria.

---

# 46. Security Architecture

Minimum security controls:

## Authentication

- OTP expiry
- OTP rate limiting
- resend cooldown
- attempt limiting
- secure session cookies

## Authorization

- server-side role checks
- protected admin endpoints
- object-level access checks for user-owned requests

## Input

- server-side schemas
- rich-text sanitization
- upload validation
- safe URL validation

## Privacy

Never expose:

- mobile numbers
- national IDs
- private requests
- private responses

through unauthenticated APIs.

## Secrets

Never commit:

- SMS API keys
- CMS secrets
- session secrets
- database credentials
- storage credentials

---

# 47. Logging and Observability

Production should provide structured logs for:

- authentication failures
- OTP send failures
- OTP verification failures
- request creation
- request status changes
- admin response creation
- application errors
- CMS integration failures
- media-processing failures

Do not log:

- plaintext OTP
- national ID
- authentication secrets
- full private request payloads unless explicitly required and safely redacted

Use correlation/request IDs where practical.

---

# 48. Testing Strategy

Testing should follow risk, not only code coverage.

## 48.1 Unit tests

Test:

- national ID checksum validation
- mobile normalization
- OTP expiration logic
- duplicate-request detection
- archive calculations
- capacity rules
- request status transitions
- validation schemas

## 48.2 Component tests

Test:

- forms
- OTP flow UI
- request forms
- search UI
- cards
- media controls
- empty/error states

## 48.3 Integration tests

Test:

- authentication API
- request creation
- duplicate prevention
- request authorization
- admin status changes
- response creation
- capacity management

## 48.4 End-to-end tests

At minimum:

### Authentication

```text
Register → OTP → authenticated session
```

### Participation

```text
Open course
→ Sign in
→ submit request
→ request visible in panel
```

### Duplicate prevention

```text
Submit request
→ submit again
→ duplicate blocked
```

### Capacity

```text
Admin marks full
→ participation CTA disabled
→ backend rejects direct submission
```

### Archive

```text
Course/event passes end date
→ public page remains
→ participation disabled
→ archive listing includes item
```

### Admin workflow

```text
New request
→ In Review
→ Contacted
→ Approved/Rejected
→ Closed
```

---

# 49. Definition-of-Done Engineering Checklist

A feature is not complete merely because the UI exists.

A feature is complete when:

- UI exists
- loading/empty/error states exist
- validation exists
- authorization exists
- server-side rules exist
- mobile layout works
- RTL works
- accessibility baseline is respected
- tests cover important behavior
- SEO is handled where applicable
- logging/error monitoring is considered
- no out-of-scope behavior has been introduced

---

# 50. Environment Strategy

Use separate environments:

```text
local
staging
production
```

Recommended environment categories:

```env
NEXT_PUBLIC_SITE_URL=

CMS_URL=
CMS_API_TOKEN=

AUTH_SECRET=

SMS_PROVIDER=
SMS_API_KEY=
SMS_SENDER=

DATABASE_URL=

STORAGE_PROVIDER=
STORAGE_BUCKET=
STORAGE_REGION=
STORAGE_ACCESS_KEY=
STORAGE_SECRET_KEY=
```

Actual variables depend on selected services.

Secrets must exist only in environment/secret management systems.

---

# 51. Deployment Architecture

The deployment architecture should support:

```text
User
 ↓
CDN / Edge
 ↓
Next.js application
 ↓
CMS / application services
 ↓
PostgreSQL
 ↓
Object storage
```

The exact infrastructure is TBD.

Deployment must include:

- environment variables
- database migration strategy
- build verification
- health checks where applicable
- logging
- error monitoring
- rollback strategy
- HTTPS
- backup policy for persistent data

---

# 52. CMS Design

Assuming Strapi is selected, define content types around the domain model rather than mirroring frontend components.

Examples:

```text
Collection Types
- Instructor
- Instructor Category
- Course Workshop
- Course Session
- Event
- Event Category
- Article
- Article Category
- Article Tag
- Media Item
- Media Tag
- Request
- Admin Response
- User

Single Types / Settings
- Homepage
- About
- Founder
- Rental
- Contact
- Site Settings
```

Use reusable components for:

```text
SEO
Social Links
CTA
Media
Flexible Content Block
```

Do not create one CMS collection type per page component.

---

# 53. CMS Permission Design

## Super Admin

Full CMS/content/application control.

## Request Admin

Only:

- requests
- request statuses
- responses
- relevant user support information
- course/event capacity operations

Request Admin should not manage:

- site settings
- SEO defaults
- roles
- unrelated content
- core configuration

Use the CMS role system plus application-layer authorization where the CMS role model alone is insufficient.

---

# 54. Content API Safety

The public frontend should receive only public fields.

Never expose an entire CMS entity by default.

Prefer explicit DTOs:

```ts
type PublicInstructor = {
  name: string;
  slug: string;
  image: MediaReference;
  title: string;
  category: PublicCategory;
  biography: string;
  socialLinks: SocialLink[];
  seo: PublicSeo;
};
```

This prevents accidental leakage when internal fields are added later.

---

# 55. DTO / Mapping Layer

Do not allow CMS response shapes to become the application's permanent public contract.

Use mapping:

```text
CMS response
    ↓
Mapper
    ↓
Domain/Public DTO
    ↓
Next.js UI
```

Benefits:

- CMS can change without rewriting UI components
- private fields are removed centrally
- frontend receives stable shapes
- tests are easier
- business rules remain outside raw CMS queries

---

# 56. Data Fetching Rules

Avoid duplicate CMS requests across a page tree.

Use:

- server-side data functions
- request memoization
- targeted caching
- shared loaders

Do not put raw `fetch()` calls across arbitrary components.

Prefer:

```text
features/courses/server/get-course.ts
features/events/server/get-event.ts
features/articles/server/get-article.ts
```

---

# 57. State Management

Do not introduce global state management unless there is a real shared client-state requirement.

Recommended default:

- server state → server components / server fetching
- form state → local form library/state
- authenticated user → server session
- URL filters → search params
- temporary UI state → local React state
- global client state → only when justified

Avoid Redux for simple request/dashboard flows unless the actual application requires complex shared client state.

---

# 58. Forms

All forms should have:

```text
idle
submitting
success
validation-error
server-error
conflict
```

On submission:

1. validate locally
2. submit to server
3. validate again
4. apply business rules
5. persist
6. return safe result
7. update UI
8. invalidate relevant data

For authenticated forms, do not trust identity fields sent by the browser when identity can be taken from the session.

---

# 59. Participation CTA State Machine

The frontend should derive CTA behavior from server-provided state.

Conceptual states:

```text
NOT_AUTHENTICATED
    → SHOW_SIGN_IN

AUTHENTICATED + AVAILABLE
    → SHOW_REQUEST

AUTHENTICATED + DUPLICATE
    → SHOW_ALREADY_SUBMITTED

FULL
    → DISABLED_FULL

ARCHIVED
    → DISABLED_ARCHIVED
```

The backend must enforce these states independently.

---

# 60. Page-Level SEO Rules

## Indexable

- Home
- About
- Founder
- Instructor pages
- Course pages
- Workshop pages
- Event pages
- Article pages
- Media pages
- Rental
- Contact where appropriate
- Public listing pages where appropriate

## Private / non-indexable

- authentication pages where appropriate
- user panel
- private request pages
- admin interfaces
- internal operational pages

---

# 61. Analytics Boundaries

The PRD does not mandate a specific analytics provider.

If analytics is introduced:

- do not send national IDs
- do not send phone numbers
- do not send private request content
- avoid sensitive query-string data
- define a privacy-safe event taxonomy

Analytics should be implemented as an integration task once the provider/account is finalized.

---

# 62. Future Extension Strategy

The architecture should make these additions possible later without redesigning the core:

- online payment
- confirmed online enrollment
- notification center
- status SMS
- comments
- multilingual content
- online education
- advanced reservations
- CRM functionality

The design should avoid prematurely implementing these features.

---

# 63. Explicit Non-Goals

The engineering team must not add these in v1 unless scope is formally changed:

```text
E-commerce
Payment gateway
Cart
Checkout
Invoice system
Equipment catalog
Equipment product pages
Public equipment pricing
Cinema portfolio
Film/project portfolio
Equipment showcase
LMS
Online classroom
Instructor dashboard
Instructor self-registration
Comments
Real-time chat
Multilingual content
Automated booking engine
Calendar-based automatic booking
Automatic capacity decrement
Non-OTP SMS notifications
Mobile application
Ongoing SEO services
Ongoing content production
```

---

# 64. Development Phases

## Phase 0 — Engineering Foundation

Before feature implementation:

- choose CMS
- finalize database
- choose SMS provider
- choose storage/CDN
- establish environments
- establish design tokens
- initialize linting/formatting
- establish testing tools
- establish CI
- define CMS permissions
- define migrations/backups

## Phase 1 — Foundation

Implement:

- repository setup
- global layout
- header/footer
- site settings
- authentication
- roles
- core UI system

## Phase 2 — Core Content

Implement:

- Home
- About
- Founder
- Instructors
- Courses/workshops
- Events
- Archive

## Phase 3 — Content Platform

Implement:

- دانش‌نامه
- Media Library
- Search

## Phase 4 — Requests

Implement:

- user panel
- request forms
- request domain
- request admin interface
- statuses
- responses
- capacity operations
- duplicate prevention

## Phase 5 — Service Pages

Implement:

- Rental
- Contact
- Consultation
- Cooperation

## Phase 6 — Finalization

Implement:

- SEO
- sitemap/robots
- responsive testing
- accessibility review
- security review
- performance optimization
- monitoring
- UI polish
- bug fixing
- deployment

---

# 65. Engineering Rules

## Rule 1 — Product scope wins

When implementation ideas conflict with `PRD.md`, the PRD wins.

## Rule 2 — Server is authoritative

Never trust frontend checks for:

- authentication
- authorization
- duplicate prevention
- capacity
- national ID validation
- request status
- private data access

## Rule 3 — Prefer simple architecture

Do not introduce:

- microservices
- event buses
- dedicated search clusters
- complex workflow engines
- multiple databases

unless a real requirement emerges.

## Rule 4 — Keep integrations replaceable

SMS and storage must be isolated behind adapters.

## Rule 5 — Keep content and application domains separate

CMS content should not own security-critical request workflows simply because it is easy to store them there.

## Rule 6 — Build reusable primitives before repetitive pages

A common UI system reduces inconsistent RTL and responsive behavior.

## Rule 7 — No page-specific hacks

Fix reusable problems at the component/design-system level where practical.

## Rule 8 — No silent scope creep

Features outside the PRD must be tracked as future work or scope change.

---

# 66. Recommended Initial Technical Decisions

These are the decisions I would make as the technical lead unless project constraints require otherwise:

### Frontend
- Next.js App Router
- TypeScript
- Server-first architecture
- Tailwind CSS/design tokens
- Zod for runtime validation

### CMS
- Strapi v5

### Database
- PostgreSQL

### Authentication
- Custom OTP application service
- secure HTTP-only session
- SMS provider adapter

### Storage
- object storage + CDN

### Search
- database-backed initial search

### Testing
- Vitest/Jest
- React Testing Library
- Playwright

### Code quality
- ESLint
- Prettier
- TypeScript strict mode
- CI checks on pull requests

### Documentation
- `PRD.md` — product requirements
- `README.md` — project overview/setup
- `DESIGN.md` — technical architecture
- additional `/docs` files as implementation decisions accumulate

---

# 67. Architecture Decision Records

When a significant technical decision changes from this design, record it.

Example:

```text
docs/adr/
├── 001-cms-selection.md
├── 002-authentication-strategy.md
├── 003-search-strategy.md
└── 004-media-storage.md
```

Each ADR should contain:

```text
Context
Decision
Alternatives considered
Consequences
Status
Date
```

This prevents architectural knowledge from living only inside developers' memory.

---

# 68. First Implementation Checklist

Before writing feature code:

- [ ] Confirm final CMS.
- [ ] Confirm database.
- [ ] Confirm SMS provider.
- [ ] Confirm media storage/CDN.
- [ ] Confirm deployment platform.
- [ ] Initialize Next.js + TypeScript.
- [ ] Configure strict TypeScript.
- [ ] Configure lint/format.
- [ ] Configure tests.
- [ ] Configure environment variables.
- [ ] Establish design tokens.
- [ ] Establish RTL base styles.
- [ ] Establish base UI primitives.
- [ ] Define CMS content types.
- [ ] Define CMS permissions.
- [ ] Define user/session model.
- [ ] Define request schemas.
- [ ] Define public DTOs.
- [ ] Define API/service boundaries.
- [ ] Configure logging/error monitoring.
- [ ] Configure CI.
- [ ] Document deployment.

---

# 69. First Vertical Slice

The first production-quality vertical slice should be intentionally small but complete.

Recommended slice:

```text
Course detail page
    ↓
Authentication
    ↓
OTP verification
    ↓
Participation request
    ↓
Duplicate prevention
    ↓
User request list
    ↓
Request Admin list
    ↓
Admin status update
    ↓
Admin response
    ↓
User sees response
```

Why this slice?

It validates the most important cross-cutting architecture:

- Next.js rendering
- CMS integration
- authentication
- authorization
- validation
- database persistence
- request domain
- admin permissions
- user panel
- caching
- security boundaries

Once this slice works end-to-end, the remaining content modules become much lower-risk.

---

# 70. Final Architecture Principle

The target architecture is:

```text
Simple at the edges
Strict at the boundaries
Reusable in the UI
Authoritative on the server
Content-driven through the CMS
Secure around private data
Fast for public pages
Extensible without premature complexity
```

The product should feel like a polished cultural/educational institute website to visitors, while internally behaving like a small, well-structured request-management system.

The most important engineering objective for v1 is not maximum technical complexity. It is a clean separation between:

```text
Public Content
       │
       ├── Search / SEO / Media
       │
       ▼
Authenticated Users
       │
       ├── Requests
       ├── Statuses
       └── Responses
       │
       ▼
Institute Operations
       │
       ├── Request Admin
       └── Super Admin
```

That separation should remain visible in the codebase, API design, data model, permissions, and deployment architecture.

# Product Requirements Document (PRD)
## Tehrani Free Cinema Institute Website

**Official Persian name:** مؤسسه آزاد سینمایی طهرانی  
**Document version:** 1.0  
**Status:** Approved scope for implementation  
**Product language:** Persian (RTL)  
**Platform:** Web  
**Frontend:** Next.js  
**CMS:** Headless CMS or another suitable CMS selected by the development team, provided it satisfies this PRD  
**Online payment:** Not included  

---

## 1. Purpose

This document defines the product requirements for the official website of **Tehrani Free Cinema Institute**.

The product is a public-facing content, registration-request, lead-management, and support platform. It must allow the institute to publish and manage its content without requiring programming knowledge, while allowing users to create a simple account and submit requests for courses, workshops, events, consultations, cooperation, equipment rental, space rental, and general contact.

This PRD is the implementation reference for version 1.0.

Where this document differs from earlier commercial proposal material, this PRD takes precedence for implementation scope.

---

## 2. Product Goals

The website must:

1. Serve as the official online presence of the institute.
2. Present the institute, its founder, instructors, and professional members.
3. Publish courses and workshops.
4. Publish events, screenings, film gatherings, and similar programs.
5. Provide a public editorial section called **دانش‌نامه**.
6. Provide a flexible public **Media Library**.
7. Present rental services without exposing an equipment catalog.
8. Allow users to register with minimal information.
9. Allow authenticated users to submit structured requests.
10. Allow institute staff to review, categorize, update, and respond to requests.
11. Provide a simple user dashboard for request tracking.
12. Be manageable by non-technical administrators.
13. Provide initial technical SEO infrastructure.
14. Be designed for future extension without unnecessary complexity in v1.

---

## 3. Product Definition

The product is best described as:

> **Content + Registration Request + Lead Management + Support Platform**

The primary user journey is:

1. Discover content, a course, an event, or a service.
2. View the relevant detail page.
3. Register or sign in if an authenticated action is required.
4. Submit a request.
5. The institute reviews the request.
6. The institute either calls the user or replies inside the user panel.
7. Final enrollment, payment, or operational coordination is completed offline.

The website is **not** an e-commerce platform in v1.

---

## 4. Product Language and Direction

- The website is Persian-only in v1.
- All user-facing interfaces must be RTL.
- All reusable UI components must be RTL-safe.
- Multilingual support is not required in v1.

---

## 5. User Roles

### 5.1 Public Visitor

A visitor who is not authenticated.

A public visitor can:

- Browse all public pages.
- View instructors and team members.
- View courses and workshops.
- View events.
- Read دانش‌نامه articles.
- Browse the Media Library.
- View rental services.
- Use global search.
- Call the institute directly through visible CTAs.
- Register or sign in.

A public visitor cannot submit authenticated requests.

---

### 5.2 Registered User

A registered user has a verified mobile number.

A registered user can:

- Manage basic profile information.
- Submit supported request types.
- View previously submitted requests.
- View request status.
- View institute responses.
- Submit course/workshop participation requests.
- Submit event/screening participation requests.
- Submit consultation requests.
- Submit cooperation requests.
- Submit equipment rental requests.
- Submit studio/space rental requests.
- Submit contact requests.

---

### 5.3 Super Admin

The Super Admin has full access to the CMS and administrative system.

The Super Admin can manage:

- Pages
- Homepage content
- Founder page
- Instructors and team members
- Instructor/team categories
- Courses and workshops
- Events
- Event categories
- دانش‌نامه
- Media Library
- Rental page content
- Contact page content
- Users
- Requests
- Site settings
- SEO fields
- Roles and permissions, if supported by the selected CMS

---

### 5.4 Request / Support Admin

The Request Admin is responsible for request operations and user support.

The Request Admin can:

- View requests.
- Filter and search requests.
- View the relevant user information.
- Call users.
- Change request status.
- Submit a response visible in the user panel.
- Close requests.
- Manage remaining capacity for courses/workshops/events.
- Manually set or unset full-capacity status.

The Request Admin must not have unrestricted access to content management or core site settings.

---

## 6. Top-Level Information Architecture

The primary navigation must include:

1. Home
2. About Us
3. Ali Azimzadeh Tehrani
4. Instructors & Team
5. Events
6. Courses & Workshops
7. دانش‌نامه
8. Media Library
9. Rental Services
10. Contact Us

The header must also provide access to:

- Global Search
- Sign In / Register
- User Profile / User Panel when authenticated

The final desktop/mobile menu structure may use dropdowns where appropriate.

---

## 7. Homepage

The homepage must be a comprehensive discovery and navigation page.

Its purpose is to:

- Introduce the institute quickly.
- Surface important current content.
- Direct users to all major sections.

### Required homepage sections

#### 7.1 Hero
Must support:

- Main headline
- Short supporting copy
- Image and/or video
- Primary CTA
- Optional secondary CTA

All hero content must be editable from the CMS.

#### 7.2 Institute Introduction
Short introduction with link to About Us.

#### 7.3 Current Courses and Workshops
A configurable list of active/current items.

#### 7.4 Upcoming Events
Upcoming/current events.

#### 7.5 Instructors and Team
Selected profiles with a link to the full listing.

#### 7.6 Founder Introduction
Short introduction to Ali Azimzadeh Tehrani with a link to the founder page.

#### 7.7 دانش‌نامه
Latest or selected articles.

#### 7.8 Media Library
Latest or selected media items.

#### 7.9 Rental Services
Short introduction and CTA.

#### 7.10 Contact / Consultation CTA
Clear CTA to contact the institute or request consultation.

All primary texts and images on the homepage must be editable by an administrator.

---

## 8. About Us

The About Us page may include:

- Institute introduction
- History
- Mission
- Vision
- Activities
- Images
- Achievements
- Other relevant institutional content

Primary page content must be editable from the CMS.

---

## 9. Founder Page: Ali Azimzadeh Tehrani

A dedicated, long-form founder profile page is required.

The page must support flexible content rather than being limited to a small set of fixed fields.

Possible content includes:

- Portrait
- Introduction
- Biography
- Resume
- Professional history
- Teaching history
- Activities
- Achievements
- Images
- Video/audio/media
- Multiple text sections

A block-based or flexible-content CMS structure is preferred.

The administrator should be able to add and manage common content blocks such as:

- Heading
- Rich text
- Image
- Gallery
- Video
- Media block

without editing source code.

---

## 10. Instructors & Team

### 10.1 Listing Page

The public listing page must show all relevant profiles.

Each card should support at least:

- Image
- Name
- Title / specialty
- Category

### 10.2 Dynamic Categories

Profile categories are not hard-coded.

The Super Admin must be able to:

- Create a category
- Edit a category
- Delete a category when safe
- Assign profiles to categories

Examples may include instructor, director, cinematographer, editor, producer, etc., but the system must not be limited to predefined values.

---

## 11. Instructor / Team Detail Page

Each profile must have a unique public URL and detail page.

At minimum, the CMS should support:

- Full name
- Image
- Title / specialty
- Category
- Biography
- Resume
- Teaching experience
- Professional experience
- Awards / achievements
- Social links
- Images / media
- SEO metadata

The biography/resume area should be flexible enough to evolve without code changes for routine content edits.

### 11.1 Relationship to Courses and Workshops

An instructor can be linked to one or more courses/workshops.

The instructor page must conditionally show:

#### Current Courses
Displayed only if at least one active/current linked course exists.

#### Past Courses
Displayed only if at least one archived linked course exists.

Empty sections must not be rendered.

---

## 12. Courses & Workshops

Course and Workshop are primary content types.

Each item must have its own detail page.

### 12.1 Required Fields

At minimum:

- Title
- Type: Course / Workshop
- Slug
- Main image
- Optional gallery/media
- Short description
- Full description
- Instructor(s)
- Start date
- End date
- Number of sessions
- Session schedule
- Time
- Venue
- Total capacity
- Remaining capacity
- Full-capacity flag
- Price
- Publication status
- SEO metadata

---

## 13. Course Sessions

A course/workshop may contain multiple sessions.

The system must support multiple session records per course/workshop.

A session may include:

- Session number or title
- Date
- Start time
- End time

---

## 14. Course and Workshop Pricing

Price must be displayable on the public detail page.

Supported display states should include:

- Numeric price
- Free

Displaying a price does not imply online payment.

Payment and final enrollment are handled offline by the institute.

---

## 15. Capacity Management

Capacity is controlled manually by institute staff.

Required fields:

- Total capacity
- Remaining capacity
- Full-capacity flag

Important rules:

- Remaining capacity must **not** automatically decrease based on the number of submitted requests.
- The Request Admin can manually update remaining capacity.
- The Request Admin can manually set or unset full-capacity status.
- When full-capacity status is active, the participation-request CTA must be disabled and a clear full-capacity message must be displayed.

---

## 16. Course / Workshop Participation Request

The user must be authenticated to submit a participation request.

If the user is not authenticated:

1. The user is directed to registration/sign-in.
2. After successful authentication, the user should return to the original course/workshop when practical.

Submitting a request does **not** mean confirmed enrollment.

The business workflow is:

> User request → institute review → telephone contact → final enrollment handled offline

### 16.1 Duplicate Prevention

A user must not be able to submit more than one participation request for the same course/workshop.

The system must detect and reject duplicate submissions.

---

## 17. Course / Workshop Archive

A course/workshop becomes archived automatically when:

> `endDate < currentDate`

Requirements:

- No manual archive move is required.
- The public detail page remains accessible.
- New participation requests are disabled after the item has ended.
- Archived items must be discoverable through archive/listing views.

---

## 18. Events

The system must have a dedicated Event content type.

Examples include:

- Film screening
- Film gathering
- Talk/session
- Review session
- Special event
- Other event types created by administrators

---

## 19. Event Categories

Event categories must be dynamic.

The Super Admin can:

- Create categories
- Edit categories
- Delete categories when safe
- Assign events to categories

---

## 20. Event Detail Page

Each event has an independent public detail page.

Required fields include:

- Title
- Category
- Image
- Short description
- Full description
- Date
- Time
- Venue
- Total capacity
- Remaining capacity
- Full-capacity flag
- Price
- Optional media
- Publication status
- SEO metadata

Events may be free.

---

## 21. Event Participation Request

An authenticated user can submit a participation request for an event or screening.

Submission does not mean confirmed participation.

Final coordination is handled by the institute, normally by telephone.

The system must prevent duplicate participation requests by the same user for the same event.

---

## 22. Event Archive

When an event has passed, it becomes archived automatically.

Requirements:

- The detail page remains public.
- The participation CTA is disabled.
- The item appears in archive views.

---

## 23. Archive Page

A public archive experience is required for past content.

At minimum it must support:

- Past events
- Past courses
- Past workshops

Preferably, users can filter by:

- Event
- Course
- Workshop

Default archive sorting should show the most recently completed items first.

---

## 24. دانش‌نامه

The public editorial/blog section is branded as **دانش‌نامه**.

### 24.1 Article Fields

At minimum:

- Title
- Slug
- Featured image
- Summary
- Main content
- Category
- Tags
- Publication date
- Draft / Published status
- SEO metadata

The article author must **not** be displayed on the public frontend.

### 24.2 Comments

Comments are not included in v1.

The implementation should not introduce unnecessary architectural constraints that would make future comment functionality unusually difficult to add.

---

## 25. Media Library

The Media Library is a public website section and is separate from the CMS's internal media manager.

Its purpose is to publish institute media in a flexible way.

### 25.1 Media Types

The content model must not be limited to one media type.

Examples include:

- Video
- Audio
- Image
- Interview
- Educational media
- Future media types

### 25.2 Media Item Fields

At minimum:

- Title
- Slug
- Description
- Tags
- Media type
- Cover / thumbnail
- Media source
- Publication status
- Publication date

### 25.3 Media Sources

Two source modes are required:

#### Direct Upload
Files uploaded to the selected storage/infrastructure.

#### External URL
Externally hosted media URL.

Where the external provider permits embedding, the media should be playable inside the website rather than forcing the user to leave the site.

---

## 26. Internal Media Player

Audio/video content should use an in-site player.

At minimum:

- Play / Pause
- Seek
- Volume
- Fullscreen for video
- Responsive behavior

The player should visually match the website design.

---

## 27. Media Tags

The Super Admin can:

- Create tags
- Edit tags
- Assign multiple tags to a media item

Tags should be usable for filtering or discovery on the public Media Library.

---

## 28. Rental Services

Rental services are presented on a single public page.

There is no public equipment catalog.

There are no public equipment product/detail pages.

Equipment rental prices are not displayed.

The Rental page must support:

- Service introduction
- Equipment rental explanation
- Space rental explanation
- Direct-call CTA
- Equipment-rental request CTA
- Space-rental request CTA

---

## 29. Rentable Spaces

The current known spaces are:

### 29.1 Training Hall
Capacity: **40 people**

### 29.2 Content Production Studio

Primary texts and images for these spaces must be editable from the CMS.

---

## 30. Space Rental Request

The form must include at least:

- Requested space
- Requested date
- Start time
- End time
- Number of people
- Intended use
- Additional notes

User identity data should be taken from the authenticated account.

---

## 31. Equipment Rental Request

There is no equipment catalog.

The user describes the required equipment in free text.

Required fields should include at least:

- Project type
- Required equipment
- Requested date
- Rental duration
- Additional notes

---

## 32. Contact Us

The Contact page should support:

- Phone number(s)
- Address
- Social links
- Other contact information
- Direct-call CTA
- Contact form
- Map, if map/location data is provided

Primary content must be editable from the CMS.

---

## 33. Direct Contact CTA

Relevant pages must show a clear direct-call CTA.

This is especially important on:

- Course/workshop pages
- Event pages
- Rental pages
- Consultation-related pages
- Contact page

Users must not be forced to create an account merely to call the institute.

On supported mobile devices, telephone CTAs should use `tel:` links.

---

## 34. User Registration and Authentication

Required registration data:

- Full name
- Mobile phone number
- Iranian national ID

The mobile number must be verified by SMS OTP.

The national ID requires:

- Format validation
- Iranian national ID checksum/algorithm validation

No government or third-party identity verification service is required.

### 34.1 Authentication Method

The recommended v1 user authentication flow is:

> Mobile number + OTP

A complex password-based system is not required unless the implementation team and project owner explicitly decide otherwise before authentication development.

---

## 35. OTP Requirements

The SMS provider is TBD.

The OTP implementation should be provider-independent enough that replacing the SMS provider does not require a major redesign.

Minimum security requirements:

- OTP expiration
- Resend cooldown
- Rate limiting
- Abuse protection
- Server-side verification

---

## 36. User Panel

The user panel must remain simple and extensible.

Minimum navigation:

- Dashboard
- My Profile
- My Requests
- My Courses & Workshops
- My Events
- Institute Responses

---

## 37. User Dashboard

The dashboard should remain lightweight.

It may show:

- Recent requests
- Current request statuses
- Recent institute responses
- Quick links to request history

A complex analytics dashboard is not required.

---

## 38. My Requests

Users must be able to view their submitted requests.

Each request entry should show at least:

- Request type
- Submission date
- Status
- Related course/event where applicable
- Latest institute response where applicable

---

## 39. Request Detail

Each request must have a detail view.

At minimum:

- Request ID
- Request type
- Submission date
- Submitted data
- Current status
- Institute response(s)
- Direct contact CTA

---

## 40. Institute Responses

A Request Admin can submit a response associated with a request.

The response must be visible to the user in the user panel.

A real-time chat or two-way messenger is not required in v1.

A simple administrator response/message model is sufficient.

---

## 41. Request Types

The system must support at least these seven request types:

1. Filmmaking consultation request
2. Cooperation request
3. Equipment rental request
4. Studio / space rental request
5. Contact request
6. Event / screening participation request
7. Course / workshop participation request

---

## 42. Filmmaking Consultation Form

At minimum:

- Subject / request title
- Description

Identity fields should be obtained from the authenticated account.

---

## 43. Cooperation Form

At minimum:

- Cooperation area
- Short introduction
- Additional details

Optional fields such as portfolio URL may be supported if useful, but should not introduce unnecessary complexity.

---

## 44. Contact Form

At minimum:

- Subject
- Message

Name/mobile should come from the authenticated account when the form is restricted to signed-in users.

---

## 45. Request Statuses

Required statuses:

1. New
2. In Review
3. Contacted
4. Approved
5. Rejected
6. Closed

User-facing Persian labels must be clear and consistent.

A complex workflow engine is not required.

---

## 46. Request Management Panel

The Request Admin requires a dedicated request-management interface.

Requests must be clearly grouped or filterable by type.

Minimum filters/search criteria:

- Request type
- Status
- Submission date
- User name
- Mobile number
- Related course/event

A quick search experience is required.

---

## 47. Request Admin Actions

From a request detail view, the Request Admin must be able to:

- View user information
- View phone number
- Initiate a phone call where supported
- Change request status
- Submit a response visible to the user
- Close the request
- Add a short internal note if supported

---

## 48. CMS Requirements

The exact CMS is selected by the development team.

The selected solution must allow a non-technical operator to manage the website without source-code changes for routine content work.

Minimum required CMS capabilities:

- CRUD for content
- Image/media management
- Rich-text editing
- Flexible content where required
- Draft/Published status
- SEO fields
- Relationships between content types
- Roles/permissions
- Media management
- Categories
- Tags

The admin interface does not need to be custom-built from scratch if the selected CMS already satisfies these requirements cleanly.

---

## 49. Static Page Content Management

All primary text and imagery on major static pages must be editable from the CMS.

At minimum:

- Home
- About
- Founder page
- Rental
- Contact

Routine text/image changes must not require source-code changes.

---

## 50. Global Search

The site requires a public search feature.

At minimum, search must include:

- دانش‌نامه articles
- Instructors and team
- Courses
- Workshops
- Events
- Media Library

Static pages may also be indexed where practical.

Search should operate on relevant titles and textual content.

Results must link directly to the corresponding detail page.

---

## 51. SEO Requirements

This project includes **initial technical SEO infrastructure**, not ongoing SEO services.

Minimum technical SEO requirements:

- SEO-friendly URLs
- Editable meta title
- Editable meta description
- Open Graph metadata
- Canonical URLs
- XML sitemap
- `robots.txt`
- Semantic HTML
- Correct heading hierarchy
- Alt text support for important images
- Slug management
- Reasonable internal linking
- Indexable public pages
- Metadata for dynamic pages

SEO fields should be editable in the CMS for major content types.

---

## 52. Structured Data

Where appropriate, the implementation may include valid structured data/schema markup matching the actual content type.

Structured data must not misrepresent the page content.

---

## 53. SEO Work Explicitly Out of Scope

The following are not part of v1 implementation:

- Ongoing content production
- Ongoing keyword research
- Link building
- Off-page SEO
- Recurring SEO reporting
- Ranking guarantees
- Ongoing SEO campaign management
- Ongoing content strategy

These may be handled under a separate agreement.

---

## 54. Responsive Design

All public and authenticated interfaces must work on:

- Mobile
- Tablet
- Desktop

Mobile usability is a priority.

---

## 55. UI/UX Process

UI/UX is developed as part of implementation.

A separate Figma approval/delivery phase is not required.

Expected process:

1. Initial implementation
2. Review
3. Feedback
4. UI/UX adjustments
5. Polish
6. Finalization

---

## 56. Publication Status

Major content types should support at least:

- Draft
- Published

Draft content must not appear publicly.

---

## 57. Slugs and URLs

Dynamic detail pages require unique URLs.

Slugs must:

- Be unique
- Be editable or generated
- Be suitable for SEO

---

## 58. Content Deletion and Archiving

Where historical relationships exist, unpublishing or archiving should be preferred over destructive deletion when practical.

Deleting an entity must not cause broken relations or frontend crashes.

---

## 59. Empty States

Dynamic sections must handle missing content gracefully.

Examples:

- Do not render "Current Courses" on an instructor page when there are none.
- Do not render "Past Courses" when there are none.
- Show a clear empty state when search returns no results.

---

## 60. Error Handling

The frontend must provide appropriate handling for:

- 404 / Not Found
- General application errors
- Unpublished/deleted content
- Form errors
- Validation errors

---

## 61. Form Validation

All forms require both:

- Client-side validation
- Server-side validation

Server-side validation is mandatory for authoritative checks.

---

## 62. Security Requirements

At minimum:

- OTP rate limiting
- OTP abuse protection
- Secure session management
- Server-side validation
- Role-based authorization
- Protection of administrative endpoints
- Upload validation
- XSS protection/sanitization for rich text
- Protection against exposing private user data through public APIs

---

## 63. Personal Data

Mobile numbers and national IDs are private user data.

They must not be exposed through:

- Public pages
- Public search
- Unauthenticated public APIs

Only authorized administrative users may access them.

---

## 64. Media Upload Requirements

Uploads must include:

- File-type validation
- File-size limits
- Safe filename/storage handling

Exact file-size limits depend on the final hosting/storage architecture.

---

## 65. Performance Requirements

Because the product is content-heavy, implementation should use:

- Image optimization
- Lazy loading
- Code splitting
- Appropriate caching
- Font optimization
- Controlled media loading
- Appropriate Next.js rendering/caching strategies

The goal is a fast and stable experience on mobile and desktop.

---

## 66. Accessibility Baseline

At minimum:

- Important images have alt text support.
- Forms have proper labels.
- Navigation uses semantic structure.
- Text remains readable.
- Interactive elements are distinguishable.
- Keyboard accessibility should not be unnecessarily blocked.

---

## 67. Participation CTA Logic

### User Not Authenticated
CTA → Sign in/Register → Return to relevant item → Submit request

### User Authenticated
CTA → Request flow

### Duplicate Request
Do not create a new request. Show a clear message that a request has already been submitted for this item.

### Full Capacity
Disable participation request.

### Archived Item
Disable participation request.

---

## 68. Request Workflow

Base workflow:

> New → In Review → Contacted → Approved / Rejected → Closed

A workflow engine is not required.

---

## 69. User Profile

Minimum displayed data:

- Full name
- Mobile number
- National ID

The profile must remain simple in v1.

If mobile-number changes are supported, the new number must be OTP verified.

---

## 70. Core Content Relationships

At minimum:

- Instructor ↔ Course/Workshop
- Course/Workshop → Participation Requests
- Event → Participation Requests
- User → Requests
- Content → Categories
- Media → Tags

Relations must be manageable from the CMS/admin interface.

---

## 71. Pagination / Progressive Loading

Large listings must not require loading all records at once.

Pagination or progressive loading should be used where appropriate, especially for:

- دانش‌نامه
- Media Library
- Instructors
- Archives
- Events
- Courses/workshops

---

## 72. Filtering

Minimum useful filters:

### Instructors & Team
- Category

### Events
- Category
- Time state where appropriate

### Archive
- Content type

### Media Library
- Tag
- Media type

---

## 73. Sorting

Time-based listings should use appropriate default sorting.

For current/upcoming content:
- Nearest relevant date first.

For archives:
- Most recently completed item first.

---

## 74. Footer

At minimum:

- Logo
- Short institute description
- Primary links
- Contact information
- Social links
- Copyright

Footer content should be manageable from CMS/site settings.

---

## 75. Global Site Settings

The Super Admin should be able to manage at least:

- Site name
- Logo
- Favicon
- Phone number
- Address
- Social links
- Footer content
- Global/default SEO settings

---

## 76. Analytics

No specific analytics platform is defined by this PRD.

If Google Analytics, Search Console, or another analytics integration is required, it should be configured as an implementation/integration task once the account details are provided.

---

## 77. SMS Notifications

SMS is used only for authentication OTP in v1.

The following are not required:

- SMS after request submission
- SMS on status change
- Course/event reminder SMS
- Marketing SMS

---

## 78. In-App Notifications

A full notification center is not required in v1.

Displaying request responses and relevant status changes inside the user panel is sufficient.

---

## 79. Future-Ready Capabilities

The architecture should not unnecessarily block later additions such as:

- Comments
- Online payments
- Confirmed online enrollment
- Notification system
- Status SMS
- Additional roles
- Multilingual content
- Online education functionality
- Advanced reservations
- More advanced CRM features

These are not v1 deliverables.

---

## 80. Explicitly Out of Scope

The following are not part of v1:

- Online payment
- Payment gateway
- Cart
- Checkout
- Invoice system
- Equipment catalog
- Equipment product pages
- Public equipment-rental prices
- Cinema Portfolio section
- Film/project portfolio section
- Equipment showcase section
- LMS
- Online classroom
- Dedicated education streaming system
- Instructor login/panel
- Instructor self-registration
- Comments
- Real-time chat
- Multilingual website
- Automated booking engine
- Calendar-based automatic booking
- Automatic capacity reduction based on submitted requests
- Non-OTP SMS notifications
- Ongoing SEO
- Ongoing content production
- Link building
- Mobile application
- Separate Figma deliverable

---

## 81. Removed From Earlier Scope

The following previously discussed concepts are explicitly removed from the final website scope:

### Cinema Portfolio
No dedicated section for film works/projects.

### Equipment Showcase
No public equipment listing or equipment catalog.

Equipment rental is handled through service explanation, direct contact, and free-text requests.

---

## 82. Acceptance Criteria — Authentication

Authentication is accepted when:

- A user can register using full name, mobile number, and national ID.
- Mobile number is OTP verified.
- National ID format/checksum is validated.
- An unverified user cannot obtain a fully active account.
- Private user information is not publicly exposed.

---

## 83. Acceptance Criteria — Courses & Workshops

The module is accepted when:

- Super Admin can create/edit courses and workshops.
- Every item has a detail page.
- Instructor relationships work.
- Multiple sessions can be defined.
- Price is displayable.
- Capacity is displayable.
- Remaining capacity can be edited by Request Admin.
- Full-capacity state is controlled manually.
- Archiving is automatic by date.
- Duplicate participation requests are blocked.
- User can see the request in the user panel.

---

## 84. Acceptance Criteria — Events

The module is accepted when:

- Admin can create event categories.
- Every event has a detail page.
- Price is displayable.
- Capacity is manageable.
- Participation requests work.
- Duplicate requests are blocked.
- Past events are archived automatically.
- Requests are visible and manageable in the admin interface.

---

## 85. Acceptance Criteria — Instructors & Team

The module is accepted when:

- Admin can create profiles.
- Categories are dynamic.
- Every profile has a public detail page.
- Courses/workshops can be linked to profiles.
- Current linked courses appear only when they exist.
- Past linked courses appear only when they exist.

---

## 86. Acceptance Criteria — Media Library

The module is accepted when:

- Super Admin can create media items.
- Titles and tags are supported.
- Direct upload is supported.
- External URL is supported.
- Audio/video can be played inside the website where applicable.
- Tags are manageable.
- Media is discoverable through browse/search/filter behavior.

---

## 87. Acceptance Criteria — Requests

Request management is accepted when:

- All seven request types can be submitted.
- Requests are clearly categorized by type.
- Status can be changed.
- Admin can quickly access relevant user details.
- Phone number is actionable.
- Admin can submit a response.
- User can see the response in the user panel.
- Required filters/search are available.

---

## 88. Acceptance Criteria — CMS

CMS/admin is accepted when a non-technical operator can, without source-code changes:

- Edit page text
- Replace page images
- Create/edit courses
- Create/edit events
- Create/edit profiles
- Publish دانش‌نامه articles
- Publish Media Library items
- Manage categories
- Manage tags
- Edit SEO metadata

---

## 89. Acceptance Criteria — Search

Search is accepted when it can return relevant results from at least:

- دانش‌نامه
- Instructors & Team
- Courses
- Workshops
- Events
- Media Library

Every result must link to the correct public detail page.

---

## 90. Acceptance Criteria — Responsive / RTL

The product is accepted when:

- Core pages work correctly on mobile, tablet, and desktop.
- No core layout breaks in RTL.
- Forms, navigation, cards, dialogs, and content layouts remain usable in Persian RTL mode.

---

## 91. Definition of Done

Version 1.0 is ready for delivery when:

1. All agreed public pages exist.
2. OTP authentication is operational.
3. User panel is operational.
4. Admin/CMS is operational.
5. Roles/permissions are applied.
6. All request types are operational.
7. Course/event automatic archive logic works.
8. Duplicate participation-request prevention works.
9. Media Library is operational.
10. Global search is operational.
11. Primary content is editable from CMS.
12. Initial SEO infrastructure is implemented.
13. Responsive behavior is verified.
14. RTL implementation is verified.
15. Main errors and validations are handled.
16. The application is deployed to the agreed infrastructure.
17. Final UI/UX polish and bug fixing are completed.

---

## 92. Technical / Product Decisions Still TBD

The following decisions do not block initial implementation but must be finalized during development:

### SMS Provider
Not selected yet.

### CMS
Selected by the development team, subject to this PRD.

### Hosting / Deployment Infrastructure
TBD.

### Media Storage / CDN
TBD based on media volume and deployment architecture.

### External Media Providers
Supported embeddable providers to be finalized during implementation.

### Upload File-Size Limits
TBD based on storage and hosting constraints.

### Production Domain
Connected during deployment.

---

## 93. Suggested Delivery Phases

### Phase 1 — Foundation
- Project setup
- CMS setup
- Authentication
- Roles/permissions
- Global layout
- Header/footer
- Global site settings

### Phase 2 — Core Content
- Home
- About
- Founder page
- Instructors & Team
- Courses & Workshops
- Events
- Archive

### Phase 3 — Content Platform
- دانش‌نامه
- Media Library
- Global Search

### Phase 4 — Requests
- User panel
- Request forms
- Request management
- Status workflow
- Admin responses
- Capacity management

### Phase 5 — Service Pages
- Rental
- Contact
- Consultation
- Cooperation

### Phase 6 — Finalization
- SEO setup
- Responsive testing
- Security review
- Performance optimization
- UI/UX polish
- Bug fixing
- Deployment

---

## 94. Scope Control

Requirements should be classified as one of:

### Must Have
Required for v1 delivery.

### Future-Ready
Not implemented in v1, but the architecture should not create unnecessary blockers for future development.

### Out of Scope
Must not be added without a new scope agreement.

This distinction is intended to prevent scope creep and unnecessary complexity.

---

## 95. Final Product Principle

The website should prioritize:

- Clear user journeys
- High-quality content presentation
- Fast request submission
- Efficient request operations for staff
- Easy non-technical content management
- SEO-friendly structure
- Performance
- RTL quality
- Maintainability
- Future extensibility

It should avoid unnecessary v1 complexity such as e-commerce, advanced booking engines, LMS functionality, or heavy CRM behavior.

**This document is the implementation reference for version 1.0.**

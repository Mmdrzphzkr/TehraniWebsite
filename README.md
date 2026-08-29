# Tehrani Free Cinema Institute Website

Official website and request-management platform for **مؤسسه آزاد سینمایی طهرانی**.

The application is a Persian, RTL-first web platform for publishing institute content, courses, workshops, events, educational/editorial content, media, and rental-service information. Registered users can submit requests, while institute staff can review and respond to them through the administrative system.

For full product requirements, see [`PRD.md`](./PRD.md).

---

## Product Overview

The application is intentionally **not** an e-commerce platform.

The main business flow is:

```text
Discover content/service
        ↓
View detail page
        ↓
Register / Sign in when required
        ↓
Submit request
        ↓
Institute reviews request
        ↓
Phone call and/or in-panel response
        ↓
Final coordination completed offline
```

There is no online payment, cart, checkout, invoice system, or automated booking engine in v1.

---

## Core Features

- Persian-only, RTL-first public website
- Responsive design
- Next.js frontend
- CMS-driven content management
- OTP-based user authentication
- Iranian national ID validation
- Simple user dashboard
- Structured request-management system
- Instructor/team profiles
- Courses and workshops
- Events and screenings
- Automatic archive behavior by end date
- دانش‌نامه editorial/blog section
- Public Media Library
- Internal audio/video player
- Direct-upload and external-media support
- Rental-service information
- Global search
- Role-based administration
- Initial technical SEO infrastructure

---

## Main Public Sections

- Home
- About Us
- Ali Azimzadeh Tehrani
- Instructors & Team
- Events
- Courses & Workshops
- دانش‌نامه
- Media Library
- Rental Services
- Contact Us
- Global Search
- Authentication
- User Panel

---

## User Roles

### Public Visitor

Can browse public content, search the site, and use direct contact CTAs.

### Registered User

Can:

- Manage a simple profile
- Submit supported requests
- View request status
- View institute responses
- View course/workshop requests
- View event requests

### Super Admin

Full access to content, settings, users, requests, SEO fields, taxonomies, and other administrative areas.

### Request / Support Admin

Limited operational role focused on:

- Requests
- User contact information required for support
- Request status
- In-panel responses
- Remaining-capacity updates
- Full-capacity status

---

## Supported Request Types

1. Filmmaking consultation
2. Cooperation
3. Equipment rental
4. Studio / space rental
5. General contact
6. Event / screening participation
7. Course / workshop participation

Base request workflow:

```text
New
 ↓
In Review
 ↓
Contacted
 ↙       ↘
Approved  Rejected
   \      /
     Closed
```

---

## Authentication

User registration requires:

- Full name
- Mobile number
- Iranian national ID

The mobile number must be verified using SMS OTP.

The national ID requires:

- Format validation
- Iranian national ID checksum validation

No external government identity-verification service is required.

### Recommended v1 sign-in

```text
Mobile number + OTP
```

The SMS provider is currently TBD.

---

## Courses, Workshops, and Events

Courses/workshops/events support:

- Public detail pages
- Date/time
- Pricing
- Capacity
- Remaining capacity
- Manual full-capacity state
- Participation requests
- Automatic archive behavior after the end date
- Duplicate-request prevention

Important:

> Remaining capacity is managed manually by institute staff and must not automatically decrease based solely on submitted requests.

Final enrollment and payment are handled offline.

---

## Media Library

The Media Library is a public content section, not merely the CMS asset manager.

It supports:

- Multiple media types
- Title
- Description
- Tags
- Cover/thumbnail
- Direct upload
- External URL
- Publication status/date
- In-site audio/video playback where supported

The implementation should support both locally/externally stored media and embeddable external sources.

---

## Rental Services

There is no public equipment catalog.

There are no equipment product pages.

Equipment-rental prices are not displayed.

Users can:

- Read about rental services
- Call the institute directly
- Submit an equipment-rental request
- Submit a space-rental request

Known rentable spaces:

- Training Hall — capacity 40
- Content Production Studio

---

## Tech Stack

### Confirmed

- **Frontend:** Next.js
- **Language:** Persian
- **Direction:** RTL

### To Be Selected

- CMS / Headless CMS
- Database, if not dictated by the selected CMS
- SMS provider
- Media storage/CDN
- Hosting/deployment infrastructure

The development team may select the CMS and supporting services, but the selected architecture must satisfy [`PRD.md`](./PRD.md).

---

## Recommended Architecture

The exact implementation may vary, but the system should preserve clear separation between public UI, authenticated user functionality, content management, and request operations.

```text
┌──────────────────────────────────────────┐
│                Next.js App               │
│                                          │
│  Public Website     Authenticated Area   │
│  - Content          - User Dashboard     │
│  - Search           - Requests           │
│  - Media            - Responses          │
└───────────────────────┬──────────────────┘
                        │
                        ▼
┌──────────────────────────────────────────┐
│           CMS / Application Layer        │
│                                          │
│  Content       Users       Requests      │
│  Taxonomies    Roles       SEO Fields    │
└───────────────────────┬──────────────────┘
                        │
              ┌─────────┴─────────┐
              ▼                   ▼
       Data / Database      Media Storage
```

The selected CMS may provide some or all of the application/backend layer.

---

## Repository Structure

The final structure depends on the chosen CMS and repository strategy.

A typical single-repository Next.js setup may look like:

```text
.
├── app/
├── components/
├── features/
├── lib/
├── public/
├── styles/
├── types/
├── tests/
├── PRD.md
├── README.md
├── package.json
└── ...
```

If the CMS is maintained as a separate application, a monorepo structure may be used instead.

Example:

```text
.
├── apps/
│   ├── web/
│   └── cms/
├── packages/
│   └── shared/
├── PRD.md
├── README.md
└── ...
```

Do not treat these examples as mandatory; keep the structure aligned with the selected stack.

---

## Local Development

The exact commands depend on the final repository setup and package manager.

For a standard Next.js application using npm:

```bash
npm install
npm run dev
```

The application is typically available at:

```text
http://localhost:3000
```

Use the scripts defined in `package.json` as the source of truth.

Common scripts should ideally include:

```bash
npm run dev
npm run build
npm run start
npm run lint
```

If tests are configured:

```bash
npm test
```

---

## Environment Variables

Create a local environment file based on the project's example file:

```bash
cp .env.example .env.local
```

The exact variables depend on the selected CMS, database, storage provider, and SMS provider.

A future `.env.example` may include variables such as:

```dotenv
# Application
NEXT_PUBLIC_SITE_URL=

# CMS
CMS_URL=
CMS_API_TOKEN=

# Authentication / Session
AUTH_SECRET=

# SMS / OTP
SMS_PROVIDER=
SMS_API_KEY=
SMS_SENDER=

# Storage
STORAGE_PROVIDER=
STORAGE_BUCKET=
STORAGE_REGION=
STORAGE_ACCESS_KEY=
STORAGE_SECRET_KEY=

# Database, if applicable
DATABASE_URL=
```

Do not commit production secrets to the repository.

---

## Development Requirements

Recommended baseline:

- Current supported Node.js LTS
- Package manager defined by the repository
- Access to the selected CMS/development environment
- Access to any required database/storage services
- SMS sandbox/test credentials once a provider is selected

The repository should pin or document the expected Node.js/package-manager versions once the implementation is initialized.

---

## Content Models

At a minimum, the application needs models/collections equivalent to:

```text
Users
Admin Roles / Permissions
Site Settings
Static Pages
Founder Page
Instructor / Team Profiles
Instructor Categories
Courses / Workshops
Course Sessions
Events
Event Categories
دانش‌نامه Articles
Article Categories
Article Tags
Media Library Items
Media Tags
Requests
Admin Responses
```

Exact naming is implementation-specific.

---

## Core Relationships

At minimum:

```text
Instructor <-> Course / Workshop

Course / Workshop -> Participation Requests

Event -> Participation Requests

User -> Requests

Content -> Categories

Media -> Tags
```

---

## Search

Global public search must cover at least:

- دانش‌نامه
- Instructors & Team
- Courses
- Workshops
- Events
- Media Library

Static pages may also be indexed.

Search results must link to public detail pages.

---

## SEO

The project includes technical SEO foundations only.

Expected implementation includes:

- SEO-friendly URLs
- Editable title/description metadata
- Open Graph metadata
- Canonical URLs
- XML sitemap
- `robots.txt`
- Semantic markup
- Correct heading structure
- Image alt support
- Dynamic metadata
- Indexable public pages

Ongoing SEO operations are not part of this repository scope.

---

## Security Notes

At minimum:

- Rate-limit OTP requests
- Enforce OTP expiry
- Validate all authoritative input server-side
- Protect admin routes/endpoints
- Apply role-based authorization
- Sanitize rich-text output
- Validate uploads
- Never expose mobile numbers or national IDs through public APIs
- Keep secrets outside source control

---

## Performance Notes

Use Next.js capabilities and standard web-performance practices, including:

- Image optimization
- Lazy loading
- Code splitting
- Appropriate caching
- Font optimization
- Controlled loading of media
- Suitable server/client component boundaries
- Suitable rendering strategy for SEO-sensitive pages

---

## RTL Requirements

All components must be tested in Persian RTL mode.

Pay particular attention to:

- Navigation
- Forms
- Inputs
- Dialogs
- Icons
- Carousels
- Pagination
- Tables
- Admin interfaces
- Rich-text content
- Media controls

Avoid assuming LTR behavior in reusable components.

---

## CMS Requirements

The selected CMS/admin solution must allow a non-technical operator to manage normal site content without editing code.

Required capabilities include:

- CRUD content management
- Rich text
- Image/media management
- Flexible blocks where needed
- Draft/Published workflow
- Relations
- Categories/tags
- SEO fields
- User/admin permissions
- Request operations or integration with the request-management UI

---

## Out of Scope for v1

Do not add the following without an explicit scope change:

- Online payment
- Payment gateway
- Shopping cart
- Checkout
- Invoicing
- Equipment catalog
- Equipment detail pages
- Public equipment-rental prices
- Cinema portfolio
- Film/project portfolio section
- Equipment showcase
- LMS
- Online classroom
- Instructor dashboard
- Instructor self-registration
- Comments
- Real-time chat
- Multilingual site
- Automated booking engine
- Automatic capacity decrement from submitted requests
- Non-OTP SMS notifications
- Ongoing SEO
- Ongoing content production
- Mobile app

---

## Implementation Phases

Recommended order:

### 1. Foundation
- Repository/project setup
- CMS
- Authentication
- Roles
- Global layout
- Header/footer
- Site settings

### 2. Core Content
- Home
- About
- Founder page
- Instructors & Team
- Courses & Workshops
- Events
- Archives

### 3. Content Platform
- دانش‌نامه
- Media Library
- Search

### 4. Requests
- User panel
- Request forms
- Admin request management
- Request status
- Admin responses
- Capacity operations

### 5. Service Pages
- Rental
- Contact
- Consultation
- Cooperation

### 6. Finalization
- SEO setup
- Responsive verification
- Security review
- Performance optimization
- UI/UX polish
- Bug fixing
- Deployment

---

## Definition of Done

The v1 release is complete when:

- All agreed public pages are implemented.
- OTP authentication works.
- User panel works.
- CMS/admin operations work.
- Role permissions work.
- All seven request types work.
- Request responses are visible to users.
- Automatic archives work.
- Duplicate participation requests are blocked.
- Capacity operations work.
- Media Library works.
- Global search works.
- CMS-managed content is editable without code changes.
- Technical SEO foundations are implemented.
- Mobile/tablet/desktop layouts are verified.
- RTL is verified.
- Critical validation/error states are handled.
- The production deployment is completed.
- Final UI/UX polish is completed.

---

## Product Requirements

The full product specification and acceptance criteria are maintained in:

[`PRD.md`](./PRD.md)

When implementation details conflict with product assumptions, review the PRD before introducing new behavior.

---

## Project Status

**Current status:** Initial implementation / repository setup.

The following technical choices are still expected to be finalized during implementation:

- CMS
- SMS provider
- Hosting
- Media storage/CDN
- External media providers
- Upload limits
- Production domain

# Tehrani Website — Next.js frontend

This folder contains the Next.js frontend (App Router) for the Tehrani Free Cinema Institute project.

Features included in this scaffold:
- Next.js App Router (TypeScript)
- Tailwind CSS with RTL-ready base (globals.css has RTL and logical property examples)
- Placeholder for Persian font (Vazirmatn) in public/fonts
- .env.example referencing Strapi v5 (CMS), Postgres DB and FarazSMS

Getting started

1. Copy `.env.example` to `.env.local` and update values (STRAPI_URL, FARAZSMS_API_KEY, etc.)
2. Install dependencies:

```bash
npm ci
```

3. Start dev server:

```bash
npm run dev
```

Notes
- Add Vazirmatn font files to `public/fonts` and uncomment the @font-face block in `styles/globals.css` for the best Persian typography.
- Backend and CMS are expected to run separately (Strapi v5 / Postgres). See the main repository README for overall architecture.

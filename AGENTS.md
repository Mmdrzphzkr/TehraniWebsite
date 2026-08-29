# Engineering Instructions

## Source of Truth

- PRD.md defines product requirements.
- DESIGN.md defines technical architecture.
- README.md defines project context.

## Rules

- TypeScript strict mode.
- Persian RTL-first.
- Next.js App Router.
- Prefer Server Components.
- Client Components only when interaction requires them.
- Business logic belongs in services/features, not UI components.
- Validate all input server-side.
- Never trust client-side authorization.
- Never expose national IDs or private phone numbers publicly.
- Follow the roles defined in DESIGN.md.
- Do not add out-of-scope features.
- Do not introduce dependencies without justification.
- Reuse existing components before creating new ones.
- Follow existing project conventions.
- Write tests for business-critical logic.
- Do not modify PRD.md or DESIGN.md to make implementation easier.
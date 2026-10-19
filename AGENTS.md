# Project Guidance

## User Preferences

- Mobile-first responsive web app
- Dark theme with green and grey tones
- Fixed categories: Comida, Transporte, Entretenimiento
- Spanish-language interface

## Verified Commands

- **typecheck**: `pnpm typecheck`
- **fix**: `pnpm fix`
- **build**: `pnpm build`

## Learnings

- Enhanced Migration is active: mops.toml [canisters.backend.migrations] chain=src/backend/migrations with check-limit=1; fold changes into the single pending migration file.
- OQL toEntity cannot derive _toRow for variant fields; use toEntityManual with explicit .payload per field.
- getApiDoc belongs in its own mixin src/backend/mixins/api-doc.mo included from main.mo, never declared inline.
- Frontend router is @tanstack/react-router (code-based createRootRoute/createRoute/createRouter), not react-router; Layout renders Outlet.
- Category/TransactionKind are value enums in @/backend; compare with TransactionKind.income, not string literals.
- Tailwind shadow tokens are custom (xs/subtle/elevated/nav); referencing an undefined shadow-* class silently drops the shadow.
- biome useFocusableInteractive requires tabIndex on a div with role=progressbar.
- Time.now() returns Int in this mo:core version; convert with .toNat() for Nat timestamp fields.

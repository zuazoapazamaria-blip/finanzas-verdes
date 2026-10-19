# Design Brief

## Direction

**Ledger Ink** — a dark, grounded fintech instrument where money is read at a glance: one dominant balance figure, green for what you have, red for what you spent.

## Tone

Quiet, confident, instrument-like — deep green-black surfaces with a single vivid bio-green accent; restraint over decoration, precision over playfulness.

## Differentiation

Every amount is set in tabular monospace with a colored sign glyph, so the ledger reads like a terminal readout — data as the aesthetic.

## Color Palette

| Token      | OKLCH        | Role                                       |
| ---------- | ------------ | ------------------------------------------ |
| background | 0.16 0.012 150 | Deep green-black app canvas              |
| foreground | 0.94 0.008 150 | Primary text, near-white with green cast |
| card       | 0.2 0.014 152  | Layered grey-green surfaces              |
| primary    | 0.78 0.19 148  | Vivid bio-green: income, positive, CTA   |
| accent     | 0.82 0.17 150  | Brighter green: active nav, highlights   |
| muted      | 0.26 0.016 152 | Inactive fills, secondary chips          |
| destructive| 0.62 0.19 22   | Coral red: expense, negative, delete     |
| warning    | 0.78 0.16 78   | Amber: caution, near-budget states       |
| chart-1..5 | green → grey ramp | Category spend ramp (148→210 hue)     |

## Typography

- Display: Space Grotesk — headings, balance figure, section titles
- Body: Satoshi — labels, form fields, list rows, nav
- Mono: JetBrains Mono — all currency amounts, tabular numerals
- Scale: hero `text-4xl font-bold tracking-tight`, h2 `text-xl font-semibold`, label `text-xs font-semibold tracking-widest uppercase`, body `text-sm`

## Elevation & Depth

Two surface planes only — `background` canvas and `card` panels — separated by 1px `border` and a soft `shadow-elevated`; the balance card uses a subtle gradient and a green top hairline instead of a glow.

## Structural Zones

| Zone    | Background            | Border    | Notes                                          |
| ------- | --------------------- | --------- | ---------------------------------------------- |
| Header  | `bg-background`       | none      | Compact app title + month label, sticky        |
| Balance | `bg-gradient-balance` | green hairline | Hero card, mono figure, income/expense chips |
| Content | `bg-background`       | —         | Cards on canvas; sections separated by `gap-6` |
| BottomNav | `bg-card/95 backdrop-blur` | `border-t` | Fixed 3 tabs, active tab green + icon |

## Spacing & Rhythm

Mobile-first: `px-4` gutters, `gap-4` between cards, `gap-6` between sections, `py-3` touch rows, minimum 44px tap targets, `pb-24` content clearance above the fixed bottom nav.

## Component Patterns

- Buttons: full-width `rounded-2xl` primary (green, dark text) for save; ghost/outline `rounded-xl` for secondary; destructive outline for delete
- Cards: `rounded-2xl bg-card border border-border shadow-elevated p-4`
- Badges: pill `rounded-full` — green for income, red for expense, `bg-muted` for category chips
- Progress bars: `h-2.5 rounded-full bg-muted` track with `chart-*` fill, highest category gets the vivid `chart-1`

## Motion

- Entrance: cards `fade-in-up` 0.35s ease-out, staggered 60ms
- Hover: `transition-smooth` on all interactive elements; press scale 0.98 on buttons
- Decorative: balance figure `pulse-soft` only while data loads; progress bars animate width on mount

## Constraints

- Dark mode only — no light theme toggle
- Fixed categories: Comida, Transporte, Entretenimiento
- Spanish-language interface throughout
- Amounts always tabular mono, never proportional numerals
- No purple, no blue, no neon glow shadows

## Signature Detail

The balance figure: oversized Space Grotesk numerals in vivid green on a gradient panel with a green hairline — a single number that owns the top third of the screen.

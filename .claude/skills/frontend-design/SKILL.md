# Frontend Design Skill

## Typography
- Use Inter or a similar modern sans-serif
- Type scale: 12, 14, 16, 18, 24, 32, 48, 64px
- Body text: 16px, line-height 1.6
- Headings: tight line-height (1.1-1.2), bold weight

## Spacing
- Use an 8px base grid (8, 16, 24, 32, 48, 64, 96, 128)
- Generous whitespace — err on the side of more space, not less

## Color
- Define exactly 3 colors: one primary, one neutral scale, one accent
- No random hex codes — use CSS variables or Tailwind tokens
- High contrast for text (WCAG AA minimum)

## Components
- Buttons: clear hover and active states, subtle shadow
- Cards: consistent padding, subtle border or shadow (not both)
- Forms: large touch targets, clear labels above inputs

## Avoid
- Generic AI aesthetic: purple gradients, rounded-2xl on everything, glow effects
- Random emoji as icons — use Lucide or Heroicons
- Cluttered hero sections — one headline, one subhead, one CTA

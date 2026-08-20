# Taap Alert design system — how to build with it

Taap Alert is a mobile-first heat-safety app for outdoor workers and district
officers in Rajasthan. Its look is **warm desert neutrals + a single teal
action colour + a five-step severity ramp**, built on **Tailwind CSS + DaisyUI**
(the `taap` and `taap-dark` themes). Same idiom as `Parivio`: utility classes,
semantic tokens, no CSS-in-JS.

## Setup — no wrapper needed

Both themes are declared in `frontend/app/globals.css` via `@plugin
"daisyui/theme"`. `taap` is the default; `taap-dark` is applied by
`prefers-color-scheme` and by an explicit `data-theme` on `<html>`. A tiny
inline script in the root layout stamps the stored choice before first paint so
the page never flashes the wrong theme.

Headings and all numerals use **Outfit**; body and UI use **Plus Jakarta Sans**;
Hindi uses **Anek Devanagari**. All three ship from Google Fonts, linked once in
the root layout.

## Styling idiom — Tailwind utilities + DaisyUI semantic tokens

Style with utility classes. Prefer the DaisyUI semantic tokens so the theme
drives colour — **do not hard-code hex**:

| Purpose | Classes |
|---|---|
| Page ground | `bg-base-200` |
| Raised surface | `.surface` (hairline + inner highlight + shadow) with `rounded-box` |
| Sunk well, tracks, insets | `bg-base-300` |
| Ink / text | `text-base-content`, muted `text-base-content/70`, quiet `text-base-content/55` |
| The one action colour | `bg-primary` / `text-primary` / `text-primary-content` |
| Inverted emphasis | `bg-neutral text-neutral-content` (countdowns, active tabs, chips) |
| Caution (not risk) | `text-warning`, `ring-warning` |
| Shape | `rounded-box` (26px cards), `rounded-field` (17px controls), `rounded-selector` (12px chips), `rounded-full` (pills) |
| Type | `font-display` (Outfit — headings and every numeral), `font-sans` (default), `font-dv` (Devanagari), `eyebrow` (lowercase label class) |
| Press feedback | `.press` (scale on `:active`) |

Standard Tailwind layout utilities apply as usual. Keep screens to a phone width
(`max-w-[452px] mx-auto`); the marketing pages may go to `max-w-3xl`.

## The band ramp is data, not state

The five severity colours live on their own scale — `var(--band-1)` …
`var(--band-5)` with matching `--band-N-ink` — and are read through
`bandFill(n)` / `bandInk(n)` in `lib/forecast/bands.ts`. **Never** map them onto
`primary` / `secondary` / `accent` / `error`.

Two properties are load-bearing and must survive any retheme:

1. **Lightness descends monotonically 1 → 5.** That is what makes severity
   readable in greyscale, on a photocopy, and to a deuteranope.
2. **Colour is never the only signal.** A band always renders with its numeral,
   and usually its label too. `BandChip` enforces this.

Stale-data cautions get `.stale-hatch` over the same fill, so "raised because
the feed aged out" is visually distinct from "raised because it is hot".

## Pictograms carry the instruction

Most people receiving these advisories read little and are outdoors in glare.
Words are the caption, not the message:

- `WorkRestDial` — the filled arc **is** the work portion; the ratio reads as a
  shape before any number.
- `Bottles` — one drawn bottle per serving in the hour, countable without reading.
- `FIG_WORK`, `FIG_REST`, `FIG_SHELTER`, `FIG_STOP` — stroke figures on a 24px
  grid, one consistent weight. Never use emoji as an icon.

## Where the truth lives

- `frontend/app/globals.css` — both themes, the band scale, `.surface`, `.eyebrow`
- `frontend/lib/forecast/model.ts` — the grading rules, pure and unit-tested
- `frontend/lib/forecast/bands.ts` — per-band guidance and the `bandFill` accessor
- `frontend/components/Pictograms.tsx` — the figure set

## One idiomatic example

```tsx
import { Card, Eyebrow, BandChip } from '@/components/Primitives';
import { useApp } from '@/lib/store';
import { dv } from '@/lib/i18n';

export function Example() {
  const { t, locale, band, block } = useApp();
  return (
    <Card className="p-5">
      <Eyebrow className={dv(locale)}>{t.dangerWindow}</Eyebrow>
      <div className="mt-3 flex items-center gap-3.5">
        <BandChip band={band} />
        <span className={`font-display text-xl font-extrabold tracking-tight ${dv(locale)}`}>
          {locale === 'hi' ? block.hi : block.en}
        </span>
      </div>
    </Card>
  );
}
```

`dv(locale)` appends `font-dv` for Hindi. Apply it to any element that can hold
translated text — Devanagari needs looser leading than Latin at the same rank.

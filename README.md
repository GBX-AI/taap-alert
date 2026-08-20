# Taap Alert

Heat-stress early warning for outdoor workers in Rajasthan.

**Live:** https://gbx-ai.github.io/taap-alert/

A prototype for the Rajasthan Innovation Challenge (CHANGE), Department of IT &
Communication. It grades heat risk for all 33 districts by **departure from what
each place is used to** rather than by absolute temperature, and delivers the
result as pictograms a labourer can act on without reading.

---

## The idea

Grading on absolute thresholds alerts the wrong districts. A body adapted to 44°
normals copes with 47°; a body adapted to 32° does not cope with 44°. Worse,
during a sustained hot spell absolute thresholds alert every district every day
until nobody listens — the alert-fatigue failure the challenge brief names.

So risk is computed as:

```
risk = apparentTemperature
     + min(max(departureFromSeasonalNormal, 0), 11) × 0.6
     − acclimatisation × 3.0
```

Open the app's **Map** tab and toggle **Risk ↔ Heat only**. Fourteen districts
move up, thirteen move down. Kota and Bharatpur rise from band 4 to 5; Jodhpur
falls from 5 to 4; Jaisalmer falls from 4 to 3. **The hottest district is not the
one most at risk** — which is the finding that makes this worth building.

## Running it

```bash
cd frontend
npm install
npm run dev          # http://localhost:3000
npm run typecheck
npm test             # model rules, including the DP-3 inversion
npm run build        # static export to frontend/out
```

Sign in with any 10-digit number and any six digits, or use a seeded demo
account on the login screen. `9414410004` is a district officer and sees the
approval queue; the others are workers and supervisors.

> `--webpack` is pinned in the build script. Turbopack + `@tailwindcss/postcss`
> 4.3 fails on Next 16.3.1 with *"Missing field `negated` on
> ScannerOptions.sources"*. Revisit when that interop is fixed.

## Layout

```
frontend/
  app/               routes — marketing, auth, and the app shell
  components/        presentational; see .design-sync/conventions.md
  lib/forecast/      the grading rules. Pure, no I/O, unit-tested
  lib/data/          provider interface + mock and http implementations
  lib/auth/          provider interface + mock OTP and aggregator stub
  lib/i18n/          English and Hindi
backend/             contract only — the FastAPI service is not built here
```

## Making it real

Three seams, each a configuration change rather than a rewrite:

| Swap | How |
|---|---|
| Forecasts | `NEXT_PUBLIC_DATA_SOURCE=http`, `NEXT_PUBLIC_API_BASE_URL=…` → `lib/data/http.ts` |
| OTP | `NEXT_PUBLIC_AUTH_SOURCE=msg91` → `lib/auth/msg91.ts` |
| Grading | Replace `lib/forecast/model.ts` with a validated occupational index |

Nothing in `app/` or `components/` imports mock data directly. That rule is what
keeps the swap honest.

Before the OTP path can be switched on: a DLT entity and header registered with
the operators, the OTP template registered, and verification moved server-side
so the client never sees the code.

## What this is not

Forecast values are **synthetic** and stand in for the downscaling pipeline.
Band thresholds, the anomaly weight and the acclimatisation credit are tuned to
produce sensible behaviour, **not** derived from occupational-health literature —
they need review against ISO 7243 (FRD open item OI-7). Acclimatisation is
proxied from climatology rather than modelled from actual recent exposure.

The Rajasthan outline is hand-traced; production needs LGD-coded boundary
polygons. District coordinates are real.

**Hindi and Marwari copy is unreviewed.** It must be read by a native speaker
before any pilot.

See [`FRD_TRACEABILITY.md`](./FRD_TRACEABILITY.md) for what is covered against
the functional specification and what is not.

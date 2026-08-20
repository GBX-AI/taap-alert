import Link from 'next/link';

const SECTIONS = [
  {
    n: '01',
    h: 'Risk is departure, not temperature',
    p: `Grading on absolute thresholds alerts the wrong districts. During a sustained hot spell it
        also alerts every district every day until nobody listens — the alert-fatigue failure the
        challenge brief names directly. Instead each block carries a 20-year seasonal normal for
        the date. Risk is the apparent temperature plus 0.6° for every degree above that normal
        (capped at 11°), minus up to 3° of credit where the local workforce is acclimatised.`,
    ref: 'DP-3 · FR-3.5',
  },
  {
    n: '02',
    h: 'Humidity, not dry bulb',
    p: `Every band is computed from apparent temperature (Steadman, as used by the Australian
        Bureau of Meteorology), so a humid 42° in Banswara and a dry 47° in Jaisalmer are compared
        on the terms the body experiences rather than the terms a thermometer reports.`,
    ref: 'FR-3.1',
  },
  {
    n: '03',
    h: 'Fail to caution, never to calm',
    p: `A feed that ages past threshold raises the band by one and marks the block with a hatch,
        so a caution driven by stale data is visually distinct from a caution driven by real heat.
        The band is never lowered on degraded input, and no block is ever left silent because
        data is missing.`,
    ref: 'DP-2 · FR-3.9, FR-3.10',
  },
  {
    n: '04',
    h: 'Escalation moves upward',
    p: `Workers cannot stop work without losing wages, so worker-facing output is protective
        guidance only. Anything that changes working conditions is addressed to supervisors and
        district officers — and at Band 5 the guidance says plainly that wages must not depend on
        continuing work that day.`,
    ref: 'DP-1',
  },
  {
    n: '05',
    h: 'Action, never a measurement',
    p: `Worker-facing output is a work-rest ratio, a water volume, an interval and a place to go.
        The pictograms carry it: the filled arc of the dial is the work portion, and the row of
        bottles is countable without reading. Numbers are the caption.`,
    ref: 'FR-3.6, FR-3.7',
  },
  {
    n: '06',
    h: 'Consume, do not reinvent',
    p: `The grading rules sit in one pure module with no I/O, so they can be replaced wholesale by
        a validated occupational index once ISO 7243 thresholds are settled with a reviewer. The
        app reads forecasts through a provider interface, so the synthetic model swaps for the
        real downscaling pipeline as a configuration change.`,
    ref: 'DP-5 · OI-7',
  },
];

export default function HowItWorks() {
  return (
    <div className="relative z-2 mx-auto max-w-3xl px-5 pt-10 pb-20 sm:px-8">
      <Link href="/" className="press surface inline-flex min-h-10 items-center gap-2 rounded-field px-4
        text-[13.5px] font-extrabold">
        <svg width={15} height={15} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.8}
          strokeLinecap="round" strokeLinejoin="round" aria-hidden><path d="M15 6l-6 6 6 6" /></svg>
        Back
      </Link>

      <h1 className="mt-8 font-display text-4xl leading-[1.1] font-black tracking-tight text-balance">
        How the grading works
      </h1>
      <p className="mt-4 max-w-[62ch] text-lg leading-relaxed text-base-content/70">
        Six decisions separate this from a thermometer with a colour scale. Each traces to a
        binding principle or requirement in the functional specification.
      </p>

      <ol className="mt-12 flex flex-col gap-8">
        {SECTIONS.map((s) => (
          <li key={s.n} className="grid gap-4 sm:grid-cols-[auto_1fr]">
            <span className="font-display text-2xl font-black tracking-tight text-base-content/25 tabular-nums">
              {s.n}
            </span>
            <div>
              <h2 className="font-display text-xl font-extrabold tracking-tight text-balance">{s.h}</h2>
              <p className="mt-2 max-w-[62ch] leading-relaxed text-base-content/70">{s.p}</p>
              <p className="mt-2 font-display text-xs font-extrabold tracking-wide text-primary">{s.ref}</p>
            </div>
          </li>
        ))}
      </ol>

      <section className="surface mt-14 rounded-box p-6">
        <h2 className="font-display text-xl font-extrabold tracking-tight">What this prototype does not do</h2>
        <ul className="mt-3 flex flex-col gap-2 text-[14px] leading-relaxed text-base-content/70">
          {[
            'Downscale real forecasts — values are synthetic and stand in for the M2 pipeline.',
            'Report validation metrics: MAE and RMSE by lead time, leave-one-district-out, band-assignment accuracy.',
            'Vary guidance by work intensity — light, moderate and heavy are one set today (FR-3.2).',
            'Keep an audit trail with data vintage, which is an acceptance criterion (AC-8).',
            'Import BOCW or MGNREGA records, deduplicate them, or record DPDP consent (M5).',
            'Solve the cooling-shelter opening plan under a facilities constraint (FR-6.3, FR-6.4).',
          ].map((x) => (
            <li key={x} className="flex gap-2.5">
              <span className="mt-2 size-1.5 shrink-0 rounded-full bg-base-content/30" />{x}
            </li>
          ))}
        </ul>
      </section>

      <p className="mt-8 text-[13px] leading-relaxed text-base-content/55">
        Band thresholds, the anomaly weight and the acclimatisation credit are tuned to produce
        sensible behaviour, not derived from occupational-health literature. They need review
        against ISO 7243 before any pilot.
      </p>
    </div>
  );
}

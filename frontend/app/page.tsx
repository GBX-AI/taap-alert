import Link from 'next/link';

/**
 * Landing page — the first thing a judge sees.
 *
 * Its whole job is to explain the one idea that makes this more than a
 * thermometer: risk is departure from what a body is used to, not absolute heat.
 */

const RAMP = [
  { n: 1, en: 'Low', hi: 'कम' },
  { n: 2, en: 'Moderate', hi: 'मध्यम' },
  { n: 3, en: 'High', hi: 'अधिक' },
  { n: 4, en: 'Very high', hi: 'बहुत अधिक' },
  { n: 5, en: 'Extreme', hi: 'अत्यधिक' },
];

const INVERSIONS = [
  { name: 'Kota', heat: 4, risk: 5, note: '+10° above its own normal, workforce unadapted' },
  { name: 'Bharatpur', heat: 4, risk: 5, note: 'eastern district, no acclimatisation to this' },
  { name: 'Jodhpur', heat: 5, risk: 4, note: 'only +5° above a 43° normal; workers adapted' },
  { name: 'Jaisalmer', heat: 4, risk: 3, note: 'an ordinary week in the desert' },
];

export default function Landing() {
  return (
    <div className="relative z-2 mx-auto max-w-3xl px-5 pt-10 pb-20 sm:px-8">
      <header className="flex items-center gap-3">
        <span className="grid size-10 place-items-center rounded-selector bg-neutral text-neutral-content">
          <svg width={21} height={21} viewBox="0 0 24 24" fill="none" stroke="currentColor"
            strokeWidth={2.2} strokeLinecap="round" aria-hidden>
            <path d="M14 14.8V5a2 2 0 1 0-4 0v9.8a4 4 0 1 0 4 0z" />
          </svg>
        </span>
        <span>
          <b className="block font-display text-lg font-extrabold tracking-tight">Taap Alert</b>
          <span className="block text-xs font-semibold text-base-content/55">
            Rajasthan Innovation Challenge · prototype
          </span>
        </span>
      </header>

      <h1 className="mt-12 font-display text-4xl leading-[1.08] font-black tracking-tight text-balance sm:text-5xl">
        The hottest district is not the one most at risk.
      </h1>
      <p className="mt-5 max-w-[62ch] text-lg leading-relaxed text-base-content/70">
        A heat-stress early warning system for construction and MGNREGA workers across all 33
        districts of Rajasthan. It grades risk by <b className="text-base-content">departure from
        what each place is used to</b> — not by the thermometer — because a body adapted to 44°
        normals copes with 47°, and a body adapted to 32° does not cope with 44°.
      </p>

      <div className="mt-8 flex flex-wrap gap-3">
        <Link href="/app/now/"
          className="press flex min-h-13 items-center rounded-field bg-primary px-6 text-[15px] font-extrabold text-primary-content">
          Open the app
        </Link>
        <Link href="/how-it-works/"
          className="press surface flex min-h-13 items-center rounded-field px-6 text-[15px] font-extrabold">
          How it works
        </Link>
      </div>

      <div className="mt-6 flex overflow-hidden rounded-field ring-1 ring-base-content/10">
        {RAMP.map((b) => (
          <span key={b.n} className="flex flex-1 flex-col items-center gap-0.5 px-1 py-3.5"
            style={{ background: `var(--band-${b.n})`, color: `var(--band-${b.n}-ink)` }}>
            <span className="font-display text-xl font-black">{b.n}</span>
            <span className="text-[10px] font-extrabold">{b.en}</span>
            <span className="font-dv text-[11px] font-semibold opacity-80">{b.hi}</span>
          </span>
        ))}
      </div>

      <section className="mt-16">
        <h2 className="font-display text-2xl font-extrabold tracking-tight">What the anomaly rule changes</h2>
        <p className="mt-2 max-w-[62ch] text-base-content/70">
          Same afternoon, same forecast. The left column grades on apparent temperature alone;
          the right grades on departure from each district&rsquo;s own seasonal normal, discounted
          by how acclimatised its workforce is. Fourteen districts move up, thirteen move down.
        </p>
        <ul className="mt-6 grid gap-3 sm:grid-cols-2">
          {INVERSIONS.map((d) => (
            <li key={d.name} className="surface flex items-center gap-3.5 rounded-box p-4">
              <span className="grid size-11 shrink-0 place-items-center rounded-selector font-display text-lg font-black"
                style={{ background: `var(--band-${d.heat})`, color: `var(--band-${d.heat}-ink)` }}>{d.heat}</span>
              <svg width={18} height={18} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.4}
                strokeLinecap="round" strokeLinejoin="round" className="shrink-0 text-base-content/40" aria-hidden>
                <path d="M5 12h13M12 6l6 6-6 6" />
              </svg>
              <span className="grid size-11 shrink-0 place-items-center rounded-selector font-display text-lg font-black"
                style={{ background: `var(--band-${d.risk})`, color: `var(--band-${d.risk}-ink)` }}>{d.risk}</span>
              <span className="min-w-0">
                <b className="block text-[15px] font-extrabold tracking-tight">{d.name}</b>
                <span className="block text-xs leading-snug text-base-content/55">{d.note}</span>
              </span>
            </li>
          ))}
        </ul>
      </section>

      <section className="mt-16 grid gap-4 sm:grid-cols-3">
        {[
          { h: 'Built for people who cannot stop and read',
            p: 'The work-rest ratio is a dial you read as a shape. Water is a countable row of bottles. Words are the caption, not the message.' },
          { h: 'Fails to caution, never to calm',
            p: 'Stale or missing data raises the band and says so with a hatch. It is never lowered on degraded input.' },
          { h: 'Works with no signal',
            p: 'Grading, guidance and the assistant all run on device. Coverage is worst exactly where the risk is highest.' },
        ].map((c) => (
          <div key={c.h} className="surface rounded-box p-5">
            <h3 className="font-display text-lg leading-snug font-extrabold tracking-tight text-balance">{c.h}</h3>
            <p className="mt-2 text-[13.5px] leading-relaxed text-base-content/70">{c.p}</p>
          </div>
        ))}
      </section>

      <footer className="mt-16 border-t border-base-content/10 pt-6 text-[13px] leading-relaxed text-base-content/55">
        <p>
          <b className="text-base-content">Prototype.</b> Forecast values are synthetic and stand in for
          the downscaling pipeline. Band thresholds and work-rest ratios are placeholders pending
          occupational-health review against ISO 7243. Hindi and Marwari copy needs native-speaker
          review before any pilot. Sign-in is a mock — no OTP is really sent.
        </p>
        <p className="mt-3">
          <Link href="/how-it-works/" className="font-bold text-primary">How it works</Link>
          <span className="mx-2 opacity-40">·</span>
          <a href="https://github.com/GBX-AI/taap-alert" className="font-bold text-primary">Source</a>
        </p>
      </footer>
    </div>
  );
}

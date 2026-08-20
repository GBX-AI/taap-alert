'use client';

/**
 * Pictograms carry the instruction; words are the caption.
 *
 * Most people receiving these advisories read little and are outdoors in glare.
 * A ratio read as a *shape* lands faster than a sentence, and a countable row
 * of bottles lands faster than "500 ml every 30 minutes".
 */

export const FIG_WORK = (
  <>
    <path d="M12 4.4a2.1 2.1 0 1 0 0 4.2 2.1 2.1 0 0 0 0-4.2z" />
    <path d="M12 9.4v6M12 15.4l-2.6 4.4M12 15.4l2.6 4.4M8.2 11.6 12 10.4l4.6 1.8 2.6 2.4" />
  </>
);

export const FIG_REST = (
  <>
    <path d="M9.4 5.4a2.1 2.1 0 1 0 0 4.2 2.1 2.1 0 0 0 0-4.2z" />
    <path d="M9.4 10.4v4.6h5.4M9.4 15h-.1l-.1 4.6M14.8 15v4.6M5.4 19.6h13.4" />
  </>
);

export const FIG_SHELTER = (
  <>
    <path d="M2.6 11 12 3.6 21.4 11" />
    <path d="M5.2 11v9.4h13.6V11" />
    <path d="M12 13.4a1.7 1.7 0 1 0 0 3.4 1.7 1.7 0 0 0 0-3.4z" />
    <path d="M12 16.8v3.6" />
  </>
);

export const FIG_STOP = (
  <>
    <path d="M12 3.2 20.8 12 12 20.8 3.2 12z" />
    <path d="M8.4 12h7.2" />
  </>
);

export function Icon({ children, size = 24, stroke = 1.9, className = '' }: {
  children: React.ReactNode; size?: number; stroke?: number; className?: string;
}) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor"
      strokeWidth={stroke} strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden>
      {children}
    </svg>
  );
}

/** The filled arc IS the work portion — the ratio is legible before any number. */
export function WorkRestDial({ work, rest, size = 112 }: { work: number; rest: number; size?: number }) {
  const r = 44;
  const circumference = 2 * Math.PI * r;
  const fraction = work + rest > 0 ? work / (work + rest) : 1;
  return (
    <svg width={size} height={size} viewBox="0 0 112 112" aria-hidden>
      <circle cx="56" cy="56" r={r} fill="none" stroke="var(--color-base-300)" strokeWidth="14" />
      <circle cx="56" cy="56" r={r} fill="none" stroke="var(--color-primary)" strokeWidth="14"
        strokeDasharray={`${circumference * fraction} ${circumference}`}
        transform="rotate(-90 56 56)" />
      <g stroke="var(--color-base-content)" strokeWidth="1.9" fill="none"
        strokeLinecap="round" strokeLinejoin="round" transform="translate(38 38) scale(1.5)">
        {FIG_WORK}
      </g>
    </svg>
  );
}

/** One drawn bottle per serving in the hour — countable without reading. */
export function Bottles({ count }: { count: number }) {
  return (
    <div className="flex min-h-10 items-end justify-center gap-1">
      {Array.from({ length: Math.min(Math.max(count, 1), 4) }, (_, i) => (
        <svg key={i} width="21" height="40" viewBox="0 0 21 40" aria-hidden>
          <path
            d="M8 1.5h5v3.4c0 1.4 3.3 2.6 3.3 6.2v24.6a2.8 2.8 0 0 1-2.8 2.8H6.5a2.8 2.8 0 0 1-2.8-2.8V11.1c0-3.6 3.3-4.8 3.3-6.2z"
            fill="color-mix(in oklab, var(--color-primary) 14%, transparent)"
            stroke="var(--color-primary)" strokeWidth="1.6" />
          <path d="M4.4 20h12.2v15.7a2.8 2.8 0 0 1-2.8 2.8H7.2a2.8 2.8 0 0 1-2.8-2.8z"
            fill="var(--color-primary)" opacity="0.85" />
        </svg>
      ))}
    </div>
  );
}

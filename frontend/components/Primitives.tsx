'use client';

import type { CSSProperties, ReactNode } from 'react';
import { bandFill, bandInk } from '@/lib/forecast/bands';
import type { Band } from '@/lib/forecast/model';

export function Card({ children, className = '', style }: {
  children: ReactNode; className?: string; style?: CSSProperties;
}) {
  return <div className={`surface rounded-box ${className}`} style={style}>{children}</div>;
}

export function Eyebrow({ children, className = '' }: { children: ReactNode; className?: string }) {
  return <span className={`eyebrow ${className}`}>{children}</span>;
}

/** A hazard placard, not a dot. Colour is never the only signal — the numeral always shows. */
export function BandChip({ band, size = 46, stale = false }: { band: Band; size?: number; stale?: boolean }) {
  return (
    <span
      className="relative grid shrink-0 place-items-center overflow-hidden rounded-selector font-display font-black"
      style={{
        width: size, height: size, background: bandFill(band), color: bandInk(band),
        fontSize: size * 0.48, letterSpacing: '-0.05em',
        boxShadow: 'inset 0 1px 0 rgb(255 255 255 / 0.2)',
      }}
    >
      {stale && <span className="stale-hatch absolute inset-0" aria-hidden />}
      <span className="relative">{band}</span>
    </span>
  );
}

export function Toast({ message }: { message: string | null }) {
  return (
    <div
      role="status"
      aria-live="polite"
      className={`fixed bottom-28 left-1/2 z-60 max-w-[86vw] -translate-x-1/2 rounded-field bg-neutral px-5 py-4
        text-center text-sm font-bold text-neutral-content shadow-lg transition-all duration-300
        ${message ? 'translate-y-0 opacity-100' : 'pointer-events-none translate-y-5 opacity-0'}`}
    >
      {message}
    </div>
  );
}

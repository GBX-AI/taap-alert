'use client';

import { useRouter } from 'next/navigation';
import { bandFill, bandInk } from '@/lib/forecast/bands';
import { bandFromHeat, type Band } from '@/lib/forecast/model';
import { forecastFor } from '@/lib/data/mock';
import { RAJASTHAN_OUTLINE, type District } from '@/lib/data/districts';
import { useApp } from '@/lib/store';

/**
 * A real equirectangular projection, cosine-corrected at 26.5°N so the state
 * silhouette holds its proportions. District markers sit at true headquarters
 * coordinates — this is a projection, not a schematic.
 *
 * The outline is hand-traced. Production must load LGD-coded boundary polygons
 * and render districts as real regions (FR-1.7, FR-6.1).
 */
const PX = (lon: number) => 12 + (lon - 69.35) * 38.9;
const PY = (lat: number) => 12 + (30.3 - lat) * 43.3;

export function RajasthanMap({ districts }: { districts: District[] }) {
  const router = useRouter();
  const { day, hour, mapMode, district: current } = useApp();

  const path =
    RAJASTHAN_OUTLINE.map(
      ([lon, lat], i) => `${i ? 'L' : 'M'}${PX(lon).toFixed(1)} ${PY(lat).toFixed(1)}`,
    ).join(' ') + ' Z';

  const bandOf = (d: District): Band => {
    const scores = d.blocks.map((b) => {
      const f = forecastFor(b.id, day);
      return mapMode === 'risk' ? f.bands[hour - 6] : bandFromHeat(f.feels[hour - 6]);
    });
    return Math.max(...scores) as Band;
  };

  return (
    <svg viewBox="0 0 372 340" className="block h-auto w-full overflow-visible"
      role="img" aria-label="Heat risk across Rajasthan">
      <defs>
        <pattern id="rj-hatch" width="7" height="7" patternTransform="rotate(45)" patternUnits="userSpaceOnUse">
          <rect width="3" height="7" fill="rgb(0 0 0 / 0.2)" />
        </pattern>
      </defs>

      <path d={path} fill="var(--color-base-300)" stroke="color-mix(in oklab, var(--color-base-content) 40%, transparent)"
        strokeWidth="1.6" strokeLinejoin="round" opacity="0.9" />

      {districts.map((d) => {
        const band = bandOf(d);
        const x = PX(d.lon);
        const y = PY(d.lat);
        const selected = d.id === current.id;
        const stale = d.blocks.some((b) => b.climate.stale);
        return (
          <g key={d.id} role="button" tabIndex={0}
            className="cursor-pointer transition-transform duration-200 hover:scale-110"
            style={{ transformOrigin: `${x}px ${y}px` }}
            aria-label={`${d.en}, band ${band}`}
            onClick={() => router.push(`/app/map/${d.id}/`)}
            onKeyDown={(e) => { if (e.key === 'Enter') router.push(`/app/map/${d.id}/`); }}>
            <title>{d.en} — band {band}</title>
            <circle cx={x} cy={y} r="13.5" fill={bandFill(band)}
              stroke={selected ? 'var(--color-base-content)' : 'rgb(0 0 0 / 0.22)'}
              strokeWidth={selected ? 3 : 1} />
            {stale && <circle cx={x} cy={y} r="13.5" fill="url(#rj-hatch)" />}
            <text x={x} y={y + 4.6} textAnchor="middle" fontFamily="var(--font-display)"
              fontWeight="800" fontSize="14" fill={bandInk(band)}>{band}</text>
            <text x={x} y={y + 24} textAnchor="middle" fontFamily="var(--font-sans)"
              fontWeight="800" fontSize="7.5" letterSpacing="0.3"
              fill="color-mix(in oklab, var(--color-base-content) 55%, transparent)">{d.ab}</text>
          </g>
        );
      })}
    </svg>
  );
}

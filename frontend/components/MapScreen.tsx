'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useApp } from '@/lib/store';
import { dv } from '@/lib/i18n';
import { bandFill, bandInk, BANDS } from '@/lib/forecast/bands';
import { bandFromHeat, type Band } from '@/lib/forecast/model';
import { forecastFor } from '@/lib/data/mock';
import { districtById, type District } from '@/lib/data/districts';
import { Card, Eyebrow } from './Primitives';
import { Icon } from './Pictograms';
import { RajasthanMap } from './RajasthanMap';

const pad = (n: number) => String(n).padStart(2, '0');

function DayHourControls() {
  const { t, locale, block, day, setDay, hour, setHour, days } = useApp();
  const hi = locale === 'hi';
  return (
    <Card className="p-5">
      <div className="flex gap-2">
        {days.map((d, idx) => {
          const dd = forecastFor(block.id, idx);
          const on = idx === day;
          return (
            <button key={d.index} onClick={() => setDay(idx)} aria-pressed={on}
              className={`press flex flex-1 flex-col items-center gap-0.5 rounded-selector py-2 ${
                on ? 'bg-neutral shadow-md' : 'bg-base-300 ring-1 ring-base-content/10'}`}>
              <span className={`text-[10px] font-extrabold uppercase ${
                on ? 'text-neutral-content/55' : 'text-base-content/55'} ${dv(locale)}`}>
                {hi ? d.hi : d.en}
              </span>
              <span className={`font-display text-[15px] font-extrabold tracking-tight ${on ? 'text-neutral-content' : ''}`}>
                {dd.peakTemp}°
              </span>
              <span className="mt-1 h-1 w-5 rounded-full" style={{ background: bandFill(dd.maxBand) }} />
            </button>
          );
        })}
      </div>
      <div className="mt-4 flex items-end justify-between gap-2.5">
        <Eyebrow className={dv(locale)}>{t.at}</Eyebrow>
        <span className="font-display text-[25px] font-extrabold tracking-tight">{pad(hour)}:00</span>
      </div>
      <input type="range" min={6} max={23} value={hour} aria-label="Hour of day"
        onChange={(e) => setHour(Number(e.target.value))}
        className="mt-3 h-7.5 w-full cursor-grab accent-primary" />
    </Card>
  );
}

export function StateMapScreen() {
  const { t, locale, districts, day, hour, mapMode, setMapMode } = useApp();

  const bandOf = (d: District): Band =>
    Math.max(...d.blocks.map((b) => {
      const f = forecastFor(b.id, day);
      return mapMode === 'risk' ? f.bands[hour - 6] : bandFromHeat(f.feels[hour - 6]);
    })) as Band;

  const feelsOf = (d: District) =>
    Math.max(...d.blocks.map((b) => forecastFor(b.id, day).feels[hour - 6]));

  const ranked = [...districts].sort((a, b) => feelsOf(b) - feelsOf(a)).slice(0, 5);

  return (
    <>
      <div>
        <h1 className={`font-display text-[26px] font-extrabold tracking-tight ${dv(locale)}`}>{t.rajasthan}</h1>
        <p className={`mt-1 text-[13.5px] leading-relaxed text-base-content/70 ${dv(locale)}`}>{t.stateSub}</p>
      </div>

      <DayHourControls />

      <div className="surface flex gap-1 rounded-field p-1">
        {(['risk', 'heat'] as const).map((m) => (
          <button key={m} onClick={() => setMapMode(m)} aria-pressed={mapMode === m}
            className={`press min-h-10.5 flex-1 rounded-selector text-[13.5px] font-extrabold transition ${
              mapMode === m ? 'bg-neutral text-neutral-content' : 'text-base-content/55'} ${dv(locale)}`}>
            {m === 'risk' ? t.modeRisk : t.modeHeat}
          </button>
        ))}
      </div>
      <p className={`-mt-1 px-0.5 text-[13.5px] leading-relaxed text-base-content/70 ${dv(locale)}`}>
        {mapMode === 'risk' ? t.modeRiskNote : t.modeHeatNote}
      </p>

      <Card className="px-2 pt-2.5 pb-4">
        <RajasthanMap districts={districts} />
        <div className="mt-3.5 flex flex-wrap items-center gap-2.25 px-3">
          <span className="flex overflow-hidden rounded-[6px] ring-1 ring-base-content/10">
            {[1, 2, 3, 4, 5].map((n) => (
              <i key={n} className="h-2.75 w-5" style={{ background: bandFill(n as Band) }} />
            ))}
          </span>
          <span className={`text-[11px] font-bold text-base-content/55 ${dv(locale)}`}>{t.legend}</span>
        </div>
      </Card>

      <div>
        <Eyebrow className={`mb-2.25 block ${dv(locale)}`}>{t.hottest}</Eyebrow>
        <Card>
          {ranked.map((d, idx) => {
            const band = bandOf(d);
            return (
              <Link key={d.id} href={`/app/map/${d.id}/`}
                className={`flex items-center gap-3 px-4 py-3.25 ${idx ? 'border-t border-base-content/10' : ''}`}>
                <span className="grid size-8.5 shrink-0 place-items-center rounded-selector font-display text-base font-black"
                  style={{ background: bandFill(band), color: bandInk(band) }}>{band}</span>
                <span className="min-w-0 flex-1">
                  <span className={`block text-[16.5px] font-extrabold tracking-tight ${dv(locale)}`}>
                    {locale === 'hi' ? d.hi : d.en}
                  </span>
                  <span className="block text-[12.5px] font-semibold text-base-content/55">
                    {BANDS[band].en} · {Math.round(feelsOf(d))}° {t.feelsLike}
                  </span>
                </span>
                <Icon size={16} stroke={2.6} className="text-base-content/40"><path d="M9 6l6 6-6 6" /></Icon>
              </Link>
            );
          })}
        </Card>
      </div>
    </>
  );
}

export function DistrictMapScreen({ districtId }: { districtId: string }) {
  const { t, locale, day, hour, mapMode, setBlock, block: current, say } = useApp();
  const router = useRouter();
  const district = districtById(districtId);
  if (!district) return <p className="p-6">Unknown district.</p>;
  const hi = locale === 'hi';

  return (
    <>
      <div>
        <nav className="flex flex-wrap items-center gap-1.5">
          <Link href="/app/map/"
            className="press rounded-selector bg-primary/12 px-2.25 py-1.25 text-[12.5px] font-extrabold text-primary">
            {t.rajasthan}
          </Link>
          <span className="text-xs text-base-content/40">›</span>
          <span className={`px-0.5 py-1.25 text-[12.5px] font-extrabold text-base-content/55 ${dv(locale)}`}>
            {hi ? district.hi : district.en}
          </span>
        </nav>
        <h1 className={`mt-2 font-display text-[26px] font-extrabold tracking-tight ${dv(locale)}`}>
          {hi ? district.hi : district.en} {t.district}
        </h1>
        <p className={`mt-1 text-[13.5px] leading-relaxed text-base-content/70 ${dv(locale)}`}>
          {district.kind === 'ward' ? t.wardSub : t.blockSub}
        </p>
      </div>

      <DayHourControls />

      <div className="grid grid-cols-2 gap-2.75">
        {district.blocks.map((b) => {
          const f = forecastFor(b.id, day);
          const band = (mapMode === 'risk' ? f.bands[hour - 6] : bandFromHeat(f.feels[hour - 6])) as Band;
          return (
            <button key={b.id}
              onClick={() => { setBlock(b.id); say(`${hi ? 'साइट: ' : 'Site set to '}${hi ? b.hi : b.en}`); router.push('/app/now/'); }}
              aria-pressed={b.id === current.id}
              className={`press relative flex min-h-27 flex-col gap-1 overflow-hidden rounded-field px-4 py-3.75
                text-left shadow-md transition ${b.id === current.id ? 'ring-3 ring-base-content' : ''}`}
              style={{ background: bandFill(band), color: bandInk(band) }}>
              {b.climate.stale && <span className="stale-hatch absolute inset-0" aria-hidden />}
              <span className="relative font-display text-[34px] leading-none font-black tracking-tighter">{band}</span>
              <span className={`relative text-[15px] font-extrabold tracking-tight ${dv(locale)}`}>{hi ? b.hi : b.en}</span>
              <span className="relative text-[11.5px] font-bold opacity-70">
                {BANDS[band].en}{b.climate.stale ? ' · stale' : ''}
              </span>
              <span className="relative font-display text-[12.5px] font-extrabold opacity-85">
                {Math.round(f.temps[hour - 6])}° / {Math.round(f.feels[hour - 6])}°
              </span>
            </button>
          );
        })}
      </div>
    </>
  );
}

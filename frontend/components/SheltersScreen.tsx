'use client';

import { useApp } from '@/lib/store';
import { dv } from '@/lib/i18n';
import { Card, Eyebrow } from './Primitives';
import { FIG_SHELTER, Icon } from './Pictograms';

/**
 * Recording a station as actually open is what turns "cooling locations
 * recommended" into "recommended vs. opened" — a reportable metric the FRD
 * asks for (§11.1) but defines no mechanism to produce. This is that mechanism.
 */
export function SheltersScreen() {
  const { t, locale, block, shelters, setShelterOpen, say } = useApp();
  const hi = locale === 'hi';

  return (
    <>
      <div>
        <Eyebrow className={dv(locale)}>{t.nearestShelter}</Eyebrow>
        <h1 className={`mt-1 font-display text-[26px] font-extrabold tracking-tight ${dv(locale)}`}>
          {t.shelterTitle}{hi ? block.hi : block.en}
        </h1>
        <p className={`mt-1 text-[13.5px] leading-relaxed text-base-content/70 ${dv(locale)}`}>{t.shelterSub}</p>
      </div>

      <Card>
        {shelters.map((s, idx) => (
          <div key={s.id} className={`flex items-center gap-3.5 px-4.5 py-4.25 ${idx ? 'border-t border-base-content/10' : ''}`}>
            <span className="grid size-11 shrink-0 place-items-center rounded-selector bg-base-300 text-base-content/70
              ring-1 ring-base-content/10">
              <Icon size={20} stroke={2.1}>{FIG_SHELTER}</Icon>
            </span>
            <span className="min-w-0 flex-1">
              <span className={`block text-[15.5px] font-extrabold tracking-tight ${dv(locale)}`}>{hi ? s.hi : s.en}</span>
              <span className="mt-0.5 block text-xs font-semibold text-base-content/55">
                {s.place} · {s.hours} · {s.capacity} {t.capacity}
              </span>
              <span className={`mt-2 inline-flex items-center rounded-full px-2.75 py-1.25 text-[11px]
                font-extrabold lowercase ${
                  s.open ? 'bg-primary text-primary-content' : 'bg-base-300 text-base-content/55 ring-1 ring-base-content/10'
                } ${dv(locale)}`}>
                {s.open ? t.opened : t.markOpen}
              </span>
            </span>
            <span className="flex flex-col items-end gap-2.25">
              <span className="font-display text-base font-extrabold tracking-tight whitespace-nowrap">{s.distance}</span>
              <button
                onClick={() => {
                  setShelterOpen(s.id, !s.open);
                  say(!s.open
                    ? (hi ? `${s.hi} — खुला दर्ज` : `${s.en} recorded as open`)
                    : (hi ? `${s.hi} — उपलब्ध नहीं` : `${s.en} marked unavailable`));
                }}
                className={`press flex min-h-10 shrink-0 items-center rounded-field px-3.75 text-[13px] font-extrabold ${
                  s.open ? 'surface' : 'bg-primary text-primary-content'} ${dv(locale)}`}>
                {s.open ? t.closeIt : t.openIt}
              </button>
            </span>
          </div>
        ))}
      </Card>

      <Card className="flex items-start gap-3.5 p-5">
        <span className="grid size-11 shrink-0 place-items-center rounded-selector bg-primary/15 text-primary">
          <Icon size={20} stroke={2.1}><path d="M12 7.5v5.5M12 16.5v.4" /><circle cx="12" cy="12" r="8.6" /></Icon>
        </span>
        <span>
          <span className={`block font-display text-base font-extrabold tracking-tight ${dv(locale)}`}>
            {hi ? 'केंद्र नहीं खोल सकते?' : 'Cannot open a station?'}
          </span>
          <p className={`mt-1 text-[13.5px] leading-relaxed text-base-content/70 ${dv(locale)}`}>
            {hi
              ? 'उपलब्ध नहीं दर्ज करें — योजना पैदल दूरी में अगला केंद्र चुन लेगी।'
              : 'Mark it unavailable and the plan re-solves for the next location within walking distance.'}
          </p>
        </span>
      </Card>
    </>
  );
}

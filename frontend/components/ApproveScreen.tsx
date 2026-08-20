'use client';

import { useCallback, useRef, useState } from 'react';
import { useApp } from '@/lib/store';
import { dv } from '@/lib/i18n';
import { bandFill, bandInk, BANDS, cycleLabel, guidanceFor, INTENSITIES, INTENSITY_LABELS } from '@/lib/forecast/bands';
import { forecastFor } from '@/lib/data/mock';
import { blockById } from '@/lib/data/districts';
import { Card, Eyebrow } from './Primitives';
import { Icon } from './Pictograms';

/**
 * Dispatching to tens of thousands of people is irreversible, so it needs a
 * deliberate gesture rather than a tap that can happen in a pocket.
 * Keyboard users get Enter/Space on the same control.
 */
function SlideConfirm({ label, onConfirm }: { label: string; onConfirm: () => void }) {
  const trackRef = useRef<HTMLDivElement>(null);
  const [x, setX] = useState(0);
  const [done, setDone] = useState(false);
  const dragging = useRef(false);
  const startX = useRef(0);
  const max = useRef(0);
  const { locale } = useApp();

  const finish = useCallback(() => {
    setDone(true);
    window.setTimeout(onConfirm, 240);
  }, [onConfirm]);

  return (
    <div ref={trackRef} role="button" tabIndex={0} aria-label={label}
      onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); finish(); } }}
      className="relative h-15.5 touch-none overflow-hidden rounded-field bg-base-300 select-none
        inset-shadow-sm ring-1 ring-base-content/10">
      <div className="absolute inset-y-0 left-0 bg-primary opacity-15 transition-[width]"
        style={{ width: 62 + x }} />
      <span className={`absolute inset-0 flex items-center justify-center pl-8 text-sm font-extrabold
        text-base-content/55 transition-opacity ${done ? 'opacity-0' : ''} ${dv(locale)}`}>{label}</span>
      <div
        onPointerDown={(e) => {
          dragging.current = true;
          startX.current = e.clientX;
          max.current = (trackRef.current?.offsetWidth ?? 0) - 62;
          (e.target as HTMLElement).setPointerCapture(e.pointerId);
        }}
        onPointerMove={(e) => {
          if (!dragging.current) return;
          setX(Math.max(0, Math.min(max.current, e.clientX - startX.current)));
        }}
        onPointerUp={() => {
          if (!dragging.current) return;
          dragging.current = false;
          if (x > max.current * 0.82) { setX(max.current); finish(); } else setX(0);
        }}
        className={`absolute top-1.25 grid size-13 cursor-grab place-items-center rounded-selector
          transition-[left] active:cursor-grabbing ${done ? 'bg-neutral text-neutral-content' : 'bg-primary text-primary-content'}`}
        style={{ left: 5 + x }}>
        <Icon size={20} stroke={2.8}><path d="M5 12h13M12 6l6 6-6 6" /></Icon>
      </div>
    </div>
  );
}

export function ApproveScreen() {
  const { t, locale, queue, approve, session, say } = useApp();
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [open, setOpen] = useState<string | null>(null);
  const hi = locale === 'hi';

  if (session && session.role !== 'officer') {
    return (
      <Card className="p-6 text-center">
        <p className={`text-base-content/70 ${dv(locale)}`}>
          {hi ? 'यह स्क्रीन केवल ज़िला अधिकारी के लिए है।' : 'This screen is for district officers only.'}
        </p>
      </Card>
    );
  }

  if (open) return <AdvisoryDetail blockId={open} onBack={() => setOpen(null)} onSent={() => { setOpen(null); }} />;

  const toggle = (id: string) =>
    setSelected((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });

  return (
    <>
      <div className="flex items-center gap-4 rounded-box bg-neutral px-5 py-5 text-neutral-content shadow-lg">
        <span className="font-display text-[42px] leading-none font-black tracking-tighter">2:14</span>
        <span className="flex-1">
          <span className={`block font-display text-base font-extrabold tracking-tight ${dv(locale)}`}>{t.approvalCloses}</span>
          <span className={`mt-0.5 block text-[12.5px] leading-snug font-semibold opacity-70 ${dv(locale)}`}>{t.approvalSub}</span>
        </span>
      </div>

      {queue.length === 0 ? (
        <Card className="px-6 py-10 text-center">
          <span className="mx-auto mb-4 grid size-16 place-items-center rounded-box bg-primary text-primary-content">
            <Icon size={30} stroke={2.8}><path d="M20 6 9.5 17 4 11.5" /></Icon>
          </span>
          <h2 className={`font-display text-2xl font-extrabold tracking-tight ${dv(locale)}`}>{t.queueClear}</h2>
          <p className={`mt-2 text-[13.5px] text-base-content/70 ${dv(locale)}`}>{t.queueClearSub}</p>
        </Card>
      ) : (
        <>
          <div>
            <div className="flex items-baseline justify-between gap-2.5">
              <h2 className={`font-display text-xl font-extrabold tracking-tight ${dv(locale)}`}>{t.awaiting}</h2>
              <Eyebrow>{queue.length} {queue.length === 1 ? t.block : t.blocks}</Eyebrow>
            </div>
            <p className={`mt-1 mb-3 text-[13.5px] text-base-content/70 ${dv(locale)}`}>{t.gateNote}</p>

            <Card>
              {queue.map((item, idx) => {
                const b = blockById(item.blockId)!;
                const f = forecastFor(b.id, item.day);
                const band = f.maxBand;
                const gated = band >= 4;
                const on = selected.has(b.id);
                return (
                  <div key={b.id} className={`flex items-center gap-3.25 px-4 py-4 ${idx ? 'border-t border-base-content/10' : ''}`}>
                    {!gated && (
                      <button onClick={() => toggle(b.id)} aria-pressed={on} aria-label={`Select ${b.en}`}
                        className={`press grid size-7 shrink-0 place-items-center rounded-[10px] transition ${
                          on ? 'bg-primary ring-1 ring-primary' : 'bg-base-300 ring-1.5 ring-base-content/10'}`}>
                        {on && <Icon size={15} stroke={3.6} className="text-primary-content"><path d="M20 6 9.5 17 4 11.5" /></Icon>}
                      </button>
                    )}
                    <span className="relative grid size-11.5 shrink-0 place-items-center overflow-hidden rounded-selector
                      font-display text-[22px] font-black tracking-tighter"
                      style={{ background: bandFill(band), color: bandInk(band) }}>
                      {b.climate.stale && <span className="stale-hatch absolute inset-0" aria-hidden />}
                      <span className="relative">{band}</span>
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className={`block text-[16.5px] font-extrabold tracking-tight ${dv(locale)}`}>{hi ? b.hi : b.en}</span>
                      <span className={`mt-0.5 block text-[12.5px] font-semibold text-base-content/55 ${dv(locale)}`}>
                        {BANDS[band].en} · {f.peakTemp}°/{f.peakFeels}° · {b.climate.stale ? t.staleNote : t.vintage}
                      </span>
                    </span>
                    {gated ? (
                      <button onClick={() => setOpen(b.id)}
                        className={`press rounded-selector bg-neutral px-3.25 py-2.25 text-[11px] font-extrabold
                          lowercase text-neutral-content ${dv(locale)}`}>{t.readFirst}</button>
                    ) : (
                      <button onClick={() => setOpen(b.id)} aria-label={`Open ${b.en}`}
                        className="press surface grid size-10 shrink-0 place-items-center rounded-selector">
                        <Icon size={16} stroke={2.6}><path d="M9 6l6 6-6 6" /></Icon>
                      </button>
                    )}
                  </div>
                );
              })}
            </Card>
          </div>

          {selected.size > 0 && (
            <SlideConfirm
              label={`${t.slideApprove} — ${selected.size} ${selected.size === 1 ? t.block : t.blocks}`}
              onConfirm={() => {
                const names = [...selected].map((id) => {
                  const b = blockById(id)!;
                  return hi ? b.hi : b.en;
                });
                approve([...selected]);
                setSelected(new Set());
                say(`${names.length} ${hi ? 'ब्लॉक 5:30 बजे निर्धारित' : 'blocks scheduled for 05:30'}`);
              }} />
          )}
        </>
      )}
    </>
  );
}

function AdvisoryDetail({ blockId, onBack, onSent }: {
  blockId: string; onBack: () => void; onSent: () => void;
}) {
  const { t, locale, approve, say, shelters } = useApp();
  const b = blockById(blockId)!;
  const f = forecastFor(b.id, 1);
  const band = f.maxBand;
  const g = BANDS[band];
  const w = guidanceFor(band, 'moderate');
  const hi = locale === 'hi';
  const shelter = shelters[0];

  const sms = `${b.hi}: कल ${g.hi} गर्मी। ${(f.window ?? '').replace('–', 'से')} तक भारी काम न करें। ${w.waterMl} मि.ली. पानी हर ${w.waterEveryMin} मिनट। ${shelter.hi} में छाया और पानी।`;
  const marwariBand: Record<number, string> = { 1: 'थोड़ी', 2: 'ठीक-ठाक', 3: 'घणी', 4: 'बौत घणी', 5: 'खतरा जितरी' };
  const marwari = `रामरामसा। ${b.hi} में काल ${marwariBand[band]} गरमी रैवैला। ${(f.window ?? '').replace('–', 'सूं')} तांई भारी काम मती करो। हर ${w.waterEveryMin} मिनट में ${w.waterMl} मि.ली. पाणी पीवो।${g.ors ? ' ओ.आर.एस. भेळो करो।' : ''} ठंडी जगै — ${shelter.hi}। फेर सुणण खातर एक दबावो।`;

  return (
    <>
      <button onClick={onBack}
        className="press surface flex min-h-10.5 items-center gap-2 self-start rounded-field px-4 text-[13.5px] font-extrabold">
        <Icon size={15} stroke={2.8}><path d="M15 6l-6 6 6 6" /></Icon>
        <span className={dv(locale)}>{t.back}</span>
      </button>

      <section className="relative overflow-hidden rounded-[32px] px-5 py-5 shadow-xl"
        style={{ background: bandFill(band), color: bandInk(band) }}>
        <div className="flex flex-wrap gap-1.5">
          <span className={`rounded-full bg-white/20 px-3 py-1.5 text-[11.5px] font-extrabold ring-1 ring-white/25 ${dv(locale)}`}>
            {hi ? b.hi : b.en}
          </span>
        </div>
        <div className="mt-4 flex items-end gap-4">
          <span className="font-display text-[100px] leading-[0.72] font-black tracking-[-0.065em]">{band}</span>
          <span>
            <span className="block font-display text-3xl leading-none font-extrabold tracking-tighter">{g.en}</span>
            <span className="mt-0.5 block font-dv text-[21px] font-semibold opacity-80">{g.hi}</span>
          </span>
        </div>
        <div className="mt-4 flex items-end justify-between gap-3 border-t border-white/25 pt-3.5">
          <span>
            <small className={`text-[10.5px] font-extrabold lowercase opacity-70 ${dv(locale)}`}>{t.dangerWindow}</small>
            <b className="mt-0.5 block font-display text-[19px] font-extrabold tracking-tight">{f.window ?? '—'}</b>
          </span>
          <span className="text-right">
            <small className={`text-[10.5px] font-extrabold lowercase opacity-70 ${dv(locale)}`}>{t.peakFeels}</small>
            <b className="mt-0.5 block font-display text-[19px] font-extrabold tracking-tight">
              {f.peakTemp}° <span className="text-sm font-bold opacity-70">/ {f.peakFeels}°</span>
            </b>
          </span>
        </div>
      </section>

      {b.climate.stale && (
        <Card className="flex items-start gap-3 p-5" style={{ boxShadow: 'inset 0 0 0 1.5px var(--color-warning)' }}>
          <span className="mt-px shrink-0 text-warning">
            <Icon size={21} stroke={2.4}><path d="M12 7.5v5.5M12 16.5v.4" /><circle cx="12" cy="12" r="8.6" /></Icon>
          </span>
          <span>
            <span className={`block font-display text-[15px] font-extrabold ${dv(locale)}`}>{t.staleNote}</span>
            <p className={`mt-1 text-[13.5px] leading-relaxed text-base-content/70 ${dv(locale)}`}>{t.staleWhy}</p>
          </span>
        </Card>
      )}

      <Card className="p-5">
        <Eyebrow className={dv(locale)}>{t.smsHindi}</Eyebrow>
        <p className="mt-2.75 rounded-field bg-base-300 px-4 py-3.5 font-dv text-[14.5px] ring-1 ring-base-content/10">{sms}</p>
        <p className="mt-3 inline-flex items-center rounded-full px-2.75 py-1.5 text-[11.5px] font-extrabold text-warning
          ring-1.5 ring-warning">{t.segWarn}</p>
      </Card>

      <Card className="overflow-hidden">
        <div className="p-5 pb-0"><Eyebrow className={dv(locale)}>{t.ivrMarwari}</Eyebrow></div>
        <p className="mx-5 mt-2.75 rounded-field border-l-3 border-primary bg-base-300 px-4 py-3.5 font-dv text-[14.5px]">
          {marwari}
        </p>
        <p className="mx-5 mt-3 inline-flex items-center rounded-full px-2.75 py-1.5 text-[11.5px] font-extrabold
          text-warning ring-1.5 ring-warning">{t.ivrWarn}</p>
        <div className="mt-3.5 flex items-start gap-2.5 bg-base-300 px-4 py-3">
          <span className="mt-px shrink-0 text-base-content/40">
            <Icon size={16} stroke={2.2}><path d="M12 7.5v5.5M12 16.5v.4" /><circle cx="12" cy="12" r="8.6" /></Icon>
          </span>
          <span className={`text-[12px] leading-relaxed text-base-content/55 ${dv(locale)}`}>{t.marwariNote}</span>
        </div>
      </Card>

      <Card className="p-5">
        <Eyebrow className={dv(locale)}>{t.auditVariants}</Eyebrow>
        <p className={`mt-1.5 text-[12.5px] leading-relaxed text-base-content/55 ${dv(locale)}`}>
          {t.auditVariantsNote}
        </p>
        <div className="mt-3 flex flex-col gap-2">
          {INTENSITIES.map((i) => {
            const gi = guidanceFor(band, i);
            return (
              <div key={i} className="flex items-center gap-3 rounded-field bg-base-300 px-3.5 py-2.75
                ring-1 ring-base-content/10">
                <span className={`w-20 shrink-0 text-[12.5px] font-extrabold ${dv(locale)}`}>
                  {hi ? INTENSITY_LABELS[i].hi : INTENSITY_LABELS[i].en}
                </span>
                <span className={`flex-1 font-display text-[13px] font-bold ${dv(locale)}`}>
                  {cycleLabel(gi, locale)}
                </span>
                <span className="font-display text-[12.5px] font-extrabold text-base-content/55 whitespace-nowrap">
                  {gi.waterMl}/{gi.waterEveryMin}m
                </span>
              </div>
            );
          })}
        </div>
      </Card>

      <Card className="p-5">
        <Eyebrow className={dv(locale)}>{t.reaches}</Eyebrow>
        <p className="mt-2 flex items-baseline gap-2.5">
          <span className="font-display text-[40px] leading-none font-black tracking-tighter">
            {(band * 2840).toLocaleString('en-IN')}
          </span>
          <span className={`text-[13.5px] text-base-content/70 ${dv(locale)}`}>{t.workers}</span>
        </p>
      </Card>

      <SlideConfirm label={t.slideSend} onConfirm={() => {
        approve([b.id]);
        say(hi ? `${b.hi} — 5:30 बजे निर्धारित` : `${b.en} scheduled for 05:30`);
        onSent();
      }} />
    </>
  );
}

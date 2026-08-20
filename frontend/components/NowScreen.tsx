'use client';

import { useState, type ReactNode } from 'react';
import { useApp } from '@/lib/store';
import { dv } from '@/lib/i18n';
import { bandFill, bandInk, cycleLabel, cyclesPerHour, INTENSITIES, INTENSITY_LABELS,
  shiftLitres, workMinutesPerHour } from '@/lib/forecast/bands';
import { forecastFor } from '@/lib/data/mock';
import { Card, Eyebrow } from './Primitives';
import { Bottles, FIG_REST, FIG_SHELTER, FIG_STOP, FIG_WORK, Icon, WorkRestDial } from './Pictograms';
import { CycleTimer } from './CycleTimer';

const pad = (n: number) => String(n).padStart(2, '0');

export function NowScreen() {
  const { t, locale, block, forecast: f, band, guidance: g, work, intensity, setIntensity,
    day, days, hour, setHour, setDay, shelters } = useApp();
  const [showMore, setShowMore] = useState(false);
  const i = hour - 6;
  const hi = locale === 'hi';
  const shelter = shelters.find((s) => s.open) ?? shelters[0];
  const conf = ({ High: t.confHigh, Medium: t.confMedium, Low: t.confLow } as const)[days[day].confidence];

  return (
    <>
      <section className="relative overflow-hidden rounded-[32px] px-5 py-5 shadow-xl"
        style={{ background: bandFill(band), color: bandInk(band) }}>
        <div className="pointer-events-none absolute inset-0"
          style={{ background: 'radial-gradient(125% 85% at 88% -12%, rgb(255 255 255 / 0.2), transparent 62%)' }} />
        <div className="relative">
          <div className="flex flex-wrap items-center gap-1.5">
            <Tag>
              <Icon size={12} stroke={2.6}>
                <circle cx="12" cy="10.5" r="3" />
                <path d="M12 21c4.5-5 7-8.2 7-11a7 7 0 1 0-14 0c0 2.8 2.5 6 7 11z" />
              </Icon>
              <span className={dv(locale)}>{hi ? block.hi : block.en}</span>
            </Tag>
            <Tag><span className={dv(locale)}>{hi ? days[day].hi : days[day].en} · {days[day].date}</span></Tag>
            <Tag><span className={dv(locale)}>{conf}</span></Tag>
          </div>

          <div className="mt-4 flex items-end gap-4">
            <span className="font-display text-[100px] leading-[0.72] font-black tracking-[-0.065em] opacity-95">{band}</span>
            <span>
              <span className="block font-display text-3xl leading-none font-extrabold tracking-tighter">{g.en}</span>
              <span className="mt-0.5 block font-dv text-[21px] font-semibold opacity-80">{g.hi}</span>
            </span>
          </div>

          <div className="mt-4 flex gap-1.5" aria-hidden>
            {[1, 2, 3, 4, 5].map((n) => (
              <i key={n} className="h-1 flex-1 rounded-full bg-current transition-opacity duration-500"
                style={{ opacity: n <= band ? 0.92 : 0.22 }} />
            ))}
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
        </div>
      </section>

      <Card className="p-5">
        <div className="flex items-baseline justify-between gap-2.5">
          <Eyebrow className={dv(locale)}>{t.dayAhead}</Eyebrow>
          <Eyebrow className={dv(locale)}>{t.tapHour}</Eyebrow>
        </div>

        <div className="mt-3.5 mb-1 flex gap-2">
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

        <div className="mt-3.5 flex h-18 items-end gap-0.5">
          {f.bands.map((v, k) => {
            const h = k + 6;
            const pct = Math.max(18, Math.min(100, 26 + ((f.feels[k] - 30) / 26) * 74));
            return (
              <button key={h} onClick={() => setHour(h)} aria-label={`${pad(h)}:00, band ${v}`}
                className={`relative min-w-0 flex-1 rounded-t-[5px] transition-all duration-300 ${
                  h === hour
                    ? 'opacity-100 ring-[3px] ring-base-content ring-offset-2 ring-offset-base-100'
                    : 'opacity-50 hover:opacity-85'}`}
                style={{ height: `${pct}%`, background: bandFill(v) }}>
                {day >= 2 && <span className="stale-hatch absolute inset-0 rounded-t-[5px]" aria-hidden />}
              </button>
            );
          })}
        </div>
        <div className="mt-2 flex justify-between text-[10.5px] font-bold text-base-content/55">
          <span>06</span><span>10</span><span>14</span><span>18</span><span>23</span>
        </div>

        <div className="mt-3.5 flex items-baseline justify-between gap-3 border-t border-base-content/10 pt-3.5">
          <span>
            <span className={`eyebrow ${dv(locale)}`}>{t.at} <span className="font-display">{pad(hour)}:00</span></span>
            <span className={`block font-display text-[22px] font-extrabold tracking-tight ${dv(locale)}`}>
              {t.band} {band} · {hi ? g.hi : g.en}
            </span>
          </span>
          <span className="text-right">
            <span className={`eyebrow ${dv(locale)}`}>{t.feelsLike}</span>
            <span className="block font-display text-[22px] font-extrabold tracking-tight">{Math.round(f.feels[i])}°</span>
          </span>
        </div>
      </Card>

      <WhyBand />

      <Card className="p-5">
        <Eyebrow className={dv(locale)}>{t.safeHours}</Eyebrow>
        <h2 className={`mt-1 font-display text-xl font-extrabold tracking-tight ${dv(locale)}`}>{t.safeTitle}</h2>
        <div className="mt-3.5 flex h-10 overflow-hidden rounded-selector ring-1 ring-base-content/10">
          {f.bands.map((v, k) => (
            <span key={k} className="grid min-w-0 flex-1 place-items-center text-[9px] font-extrabold"
              style={{ background: bandFill(v), color: bandInk(v) }} title={`${pad(k + 6)}:00`}>
              {(k + 6) % 4 === 2 ? pad(k + 6) : ''}
            </span>
          ))}
        </div>
        <div className="mt-3 flex flex-wrap gap-3.5">
          {([[1, t.keyWork], [3, t.keyCycle], [4, t.keyAvoid], [5, t.keyStop]] as const).map(([n, label]) => (
            <span key={n} className={`flex items-center gap-1.5 text-[11.5px] font-bold text-base-content/55 ${dv(locale)}`}>
              <i className="size-3 rounded-[4px]" style={{ background: bandFill(n) }} />{label}
            </span>
          ))}
        </div>
      </Card>

      {work.stop && (
        <div className="flex items-center gap-3.5 rounded-box px-5 py-4 shadow-lg"
          style={{ background: bandFill(5), color: bandInk(5) }}>
          <Icon size={42} stroke={1.8}>{FIG_STOP}</Icon>
          <span>
            <span className={`block text-[19px] font-extrabold tracking-tight ${dv(locale)}`}>{t.stopWork}</span>
            <span className={`mt-0.5 block text-[13px] opacity-85 ${dv(locale)}`}>{t.stopSub}</span>
          </span>
        </div>
      )}

      <Card className="p-5">
        <div className="flex items-baseline justify-between gap-2.5">
          <Eyebrow className={dv(locale)}>{t.workType}</Eyebrow>
          <Eyebrow className={dv(locale)}>{t.workTypeHint}</Eyebrow>
        </div>
        <div className="mt-3 flex gap-2">
          {INTENSITIES.map((i) => (
            <button key={i} onClick={() => setIntensity(i)} aria-pressed={intensity === i}
              className={`press flex-1 rounded-selector py-2.5 text-[13px] font-extrabold transition ${
                intensity === i ? 'bg-neutral text-neutral-content shadow-md'
                                : 'bg-base-300 text-base-content/55 ring-1 ring-base-content/10'} ${dv(locale)}`}>
              {hi ? INTENSITY_LABELS[i].hi : INTENSITY_LABELS[i].en}
            </button>
          ))}
        </div>
        <p className={`mt-2.5 text-[12.5px] leading-relaxed text-base-content/55 ${dv(locale)}`}>
          {hi ? INTENSITY_LABELS[intensity].exampleHi : INTENSITY_LABELS[intensity].exampleEn}
        </p>
      </Card>

      <Card>
        <div className="flex items-baseline justify-between gap-2.5 px-5 pt-4">
          <Eyebrow className={dv(locale)}>{t.cycle}</Eyebrow>
          <span className="font-display text-[11px] font-extrabold text-base-content/55">
            {workMinutesPerHour(work)} / 60 min
          </span>
        </div>
        <div className="flex items-center gap-4 px-5 pt-3 pb-4">
          <WorkRestDial work={work.stop ? 0 : work.workMin || 1} rest={work.stop ? 60 : work.restMin} />
          <div className="flex min-w-0 flex-1 flex-col gap-3">
            <Metric icon={FIG_WORK} tone="on" value={work.stop ? 0 : work.workMin || '—'} unit={t.minWork} />
            <Metric icon={FIG_REST} tone="off" value={work.stop ? 60 : work.restMin || '—'} unit={t.minRest} />
          </div>
        </div>
        <p className={`border-t border-base-content/10 px-5 py-3.5 text-[13.5px] leading-relaxed
          text-base-content/70 ${dv(locale)}`}>
          {cycleLabel(work, locale)} — {hi ? g.adviceHi : g.adviceEn}
        </p>
      </Card>

      <div className="grid grid-cols-2 gap-3">
        <Card className="flex flex-col items-center gap-2 px-4 py-4 text-center">
          <Eyebrow className={dv(locale)}>{t.water}</Eyebrow>
          <Bottles count={Math.round(60 / work.waterEveryMin)} />
          <span>
            <span className="block font-display text-[31px] leading-none font-black tracking-tighter">{work.waterMl}</span>
            <span className={`block text-[13px] font-bold text-base-content/70 ${dv(locale)}`}>
              {hi ? `मि.ली. · हर ${work.waterEveryMin} मिनट` : `ml · every ${work.waterEveryMin} min`}
            </span>
          </span>
        </Card>

        <Card className="flex flex-col items-center gap-2 px-4 py-4 text-center">
          <Eyebrow className={dv(locale)}>{t.nearestShelter}</Eyebrow>
          <span className="text-primary"><Icon size={52} stroke={1.7}>{FIG_SHELTER}</Icon></span>
          <span>
            <span className="block font-display text-[31px] leading-none font-black tracking-tighter">{shelter.distance}</span>
            <span className={`block text-[13px] font-bold text-base-content/70 ${dv(locale)}`}>
              {hi ? shelter.hi : shelter.en}
            </span>
          </span>
        </Card>
      </div>

      <button onClick={() => setShowMore((v) => !v)} aria-expanded={showMore}
        className="press surface flex min-h-13 w-full items-center justify-center gap-2 rounded-field text-sm font-extrabold text-base-content/70">
        <span className={dv(locale)}>{showMore ? t.lessDetail : t.moreDetail}</span>
        <Icon size={15} stroke={2.6} className={`transition-transform ${showMore ? 'rotate-180' : ''}`}>
          <path d="M6 9l6 6 6-6" />
        </Icon>
      </button>

      {showMore && (
        <>
          <Card>
            <dl className="grid grid-cols-2 gap-px overflow-hidden rounded-box bg-base-content/10">
              <Fact k={t.perHour} v={cyclesPerHour(work) ?? '—'} />
              <Fact k={t.restAt} v={restClock(hour, work.workMin, work.restMin)} />
              <Fact k={t.shiftTotal} v={`${shiftLitres(work)} L`} />
              <Fact k={t.ors} v={g.ors ? t.orsYes : t.orsNo} />
              <Fact k={t.openHours} v={shelter.hours} />
              <Fact k={t.capacity} v={String(shelter.capacity)} />
            </dl>
            <div className="flex items-start gap-2.5 rounded-b-box bg-base-300 px-4 py-3">
              <span className="mt-px shrink-0 text-warning">
                <Icon size={17} stroke={2.3}><path d="M12 7.5v5.5M12 16.5v.4" /><circle cx="12" cy="12" r="8.6" /></Icon>
              </span>
              <span className={`text-[12.5px] leading-relaxed text-base-content/70 ${dv(locale)}`}>{t.waterCap}</span>
            </div>
          </Card>

          <Card className="px-5 py-4">
            <Eyebrow className={dv(locale)}>{t.onSite}</Eyebrow>
            <p className={`mt-1 font-display text-[19px] font-extrabold tracking-tight ${dv(locale)}`}>
              {cycleLabel(work, locale)}
            </p>
            <ul className="mt-3.5 flex flex-col gap-2.5">
              {(hi ? g.rulesHi : g.rulesEn).map((rule) => (
                <li key={rule} className={`flex items-start gap-2.5 text-sm leading-relaxed text-base-content/70 ${dv(locale)}`}>
                  <span className="mt-px grid size-5 shrink-0 place-items-center rounded-[7px] bg-primary/15 text-primary">
                    <Icon size={12} stroke={3.2}><path d="M20 6 9.5 17 4 11.5" /></Icon>
                  </span>
                  {rule}
                </li>
              ))}
            </ul>
          </Card>
        </>
      )}

      <CycleTimer />
      <Emergency />
    </>
  );
}

function Tag({ children }: { children: ReactNode }) {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full bg-white/20 py-1.5 pr-3 pl-2
      text-[11.5px] font-extrabold ring-1 ring-white/25">{children}</span>
  );
}

function Metric({ icon, tone, value, unit }: {
  icon: ReactNode; tone: 'on' | 'off'; value: number | string; unit: string;
}) {
  const { locale } = useApp();
  return (
    <span className="flex items-center gap-3">
      <span className={`grid size-10 shrink-0 place-items-center rounded-selector ${
        tone === 'on' ? 'bg-primary/15 text-primary' : 'bg-base-300 text-base-content/55'}`}>
        <Icon size={24}>{icon}</Icon>
      </span>
      <span>
        <span className="block font-display text-[32px] leading-none font-black tracking-tighter">{value}</span>
        <span className={`block text-[12.5px] font-bold text-base-content/55 ${dv(locale)}`}>{unit}</span>
      </span>
    </span>
  );
}

function Fact({ k, v }: { k: string; v: string }) {
  const { locale } = useApp();
  return (
    <div className="flex flex-col gap-0.5 bg-base-100 px-4 py-3">
      <dt className={`eyebrow ${dv(locale)}`}>{k}</dt>
      <dd className="font-display text-[17px] font-extrabold tracking-tight">{v}</dd>
    </div>
  );
}

function restClock(hour: number, work: number, rest: number) {
  if (!work) return '—';
  const out: string[] = [];
  let clock = hour * 60;
  for (let n = 0; n < 2; n++) {
    clock += work;
    out.push(`${pad(Math.floor(clock / 60) % 24)}:${pad(clock % 60)}`);
    clock += rest;
  }
  return out.join(' · ');
}

function WhyBand() {
  const { t, locale, block, forecast: f, band, hour } = useApp();
  const i = hour - 6;
  const hi = locale === 'hi';
  const feels = f.feels[i];
  const normal = f.normalFeels[i];
  const anomaly = f.anomaly[i];
  const acclimLabel = f.acclim > 0.66 ? t.acHigh : f.acclim > 0.33 ? t.acMid : t.acLow;
  const scale = (v: number) => Math.max(4, Math.min(100, ((v - 28) / 28) * 100));
  const name = hi ? block.hi : block.en;

  const explain =
    anomaly >= 6 && f.acclim < 0.34
      ? hi
        ? `${name} में लोग इतनी गरमी के आदी नहीं हैं। सामान्य से ${anomaly.toFixed(1)}° ज़्यादा होने पर शरीर को ढलने का समय नहीं मिलता — इसीलिए कम तापमान पर भी बैंड ${band}।`
        : `Workers in ${name} are not adapted to this. A ${anomaly.toFixed(1)}° jump above normal gives the body no time to adjust, which is why the band is ${band} even at a lower temperature.`
      : f.acclim >= 0.66 && anomaly < 4
        ? hi
          ? `${name} में गरमी सामान्य है और यहाँ के मज़दूर इसके आदी हैं। इसलिए ऊँचे तापमान पर भी बैंड ${band} रहता है — पर सावधानी फिर भी ज़रूरी।`
          : `Heat is normal in ${name} and the local workforce is adapted to it, so the band stays at ${band} despite a high reading. It still needs care.`
        : hi
          ? `आज ${name} अपने सामान्य से ${anomaly.toFixed(1)}° ऊपर है। बैंड इसी अंतर से तय होता है, केवल तापमान से नहीं।`
          : `${name} is ${anomaly.toFixed(1)}° above its own seasonal normal today. The band follows that departure, not the temperature alone.`;

  return (
    <Card className="p-5">
      <div className="flex items-center justify-between gap-2.5">
        <Eyebrow className={dv(locale)}>{t.why}</Eyebrow>
        <Eyebrow>{pad(hour)}:00</Eyebrow>
      </div>

      <div className="mt-3.5 flex flex-col gap-2.5">
        <Bar label={t.rNormal} value={Math.round(normal)} width={scale(normal)} colour="var(--color-base-content)" dim />
        <Bar label={t.rToday} value={Math.round(feels)} width={scale(feels)} colour={bandFill(band)} />
      </div>

      <div className="mt-4 flex items-center gap-3 border-t border-base-content/10 pt-3.5">
        <span className="flex-1">
          <span className={`eyebrow ${dv(locale)}`}>{t.rDeparture}</span>
          <span className="block font-display text-[29px] leading-tight font-black tracking-tight"
            style={{ color: anomaly >= 6 ? bandFill(5) : anomaly >= 3 ? bandFill(4) : undefined }}>
            {anomaly > 0 ? '+' : ''}{anomaly.toFixed(1)}°
          </span>
        </span>
        <span className="flex-1">
          <span className={`eyebrow ${dv(locale)}`}>{t.rAcclim}</span>
          <span className={`mt-1 block font-display text-[19px] leading-tight font-extrabold tracking-tight ${dv(locale)}`}>
            {acclimLabel}
          </span>
        </span>
        <span className="grid size-13 shrink-0 place-items-center rounded-selector font-display text-[26px] font-black tracking-tighter"
          style={{ background: bandFill(band), color: bandInk(band) }}>{band}</span>
      </div>

      <p className={`mt-3 text-[13.5px] leading-relaxed text-base-content/70 ${dv(locale)}`}>{explain}</p>
    </Card>
  );
}

function Bar({ label, value, width, colour, dim }: {
  label: string; value: number; width: number; colour: string; dim?: boolean;
}) {
  const { locale } = useApp();
  return (
    <div>
      <div className="mb-1 flex items-baseline justify-between">
        <span className={`text-[12.5px] font-bold ${dv(locale)}`}>{label}</span>
        <span className={`font-display text-[15px] font-extrabold ${dim ? 'text-base-content/55' : ''}`}>{value}°</span>
      </div>
      <div className="h-2 overflow-hidden rounded-full bg-base-300">
        <div className="h-full rounded-full transition-all duration-500"
          style={{ width: `${width}%`, background: colour, opacity: dim ? 0.5 : 1 }} />
      </div>
    </div>
  );
}

function Emergency() {
  const { t, locale, say } = useApp();
  return (
    <div className="surface overflow-hidden rounded-box" style={{ boxShadow: `inset 0 0 0 1.5px ${bandFill(5)}` }}>
      <div className="flex items-start gap-3.5 px-5 pt-5 pb-3.5">
        <span className="grid size-11 shrink-0 place-items-center rounded-selector"
          style={{ background: bandFill(5), color: bandInk(5) }}>
          <Icon size={21} stroke={2.5}><path d="M12 7.5v6M12 17v.4" /><circle cx="12" cy="12" r="8.6" /></Icon>
        </span>
        <span>
          <h2 className={`font-display text-xl font-extrabold tracking-tight ${dv(locale)}`}>{t.sosTitle}</h2>
          <p className={`mt-1 text-[13.5px] leading-relaxed text-base-content/70 ${dv(locale)}`}>{t.sosSub}</p>
        </span>
      </div>
      <ul className="flex flex-col gap-2.5 px-5 pb-4">
        {[t.sos1, t.sos2, t.sos3, t.sos4].map((s) => (
          <li key={s} className={`flex items-center gap-2.5 text-sm text-base-content/70 ${dv(locale)}`}>
            <span className="size-1.5 shrink-0 rounded-full" style={{ background: bandFill(5) }} />{s}
          </li>
        ))}
      </ul>
      <div className="flex items-start gap-2.5 bg-base-300 px-4 py-3">
        <span className="mt-px shrink-0" style={{ color: bandFill(5) }}>
          <Icon size={17} stroke={2.3}><path d="M20 6 9.5 17 4 11.5" /></Icon>
        </span>
        <span className={`text-[12.5px] leading-relaxed text-base-content/70 ${dv(locale)}`}>{t.sosAction}</span>
      </div>
      <button onClick={() => say(t.sosToast)}
        className="flex w-full items-center justify-center gap-2.5 py-4 text-base font-extrabold transition hover:brightness-110"
        style={{ background: bandFill(5), color: bandInk(5) }}>
        <Icon size={19} stroke={2.4}>
          <path d="M6.5 4h3l1.5 4-2 1.5a11 11 0 0 0 5.5 5.5L16 13l4 1.5v3a2 2 0 0 1-2.3 2A16.5 16.5 0 0 1 4.5 6.3 2 2 0 0 1 6.5 4z" />
        </Icon>
        <span className={dv(locale)}>{t.sosBtn}</span>
      </button>
    </div>
  );
}

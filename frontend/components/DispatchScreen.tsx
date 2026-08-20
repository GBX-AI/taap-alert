'use client';

import { useMemo, useState } from 'react';
import { useApp } from '@/lib/store';
import { dv } from '@/lib/i18n';
import { bandFill, bandInk } from '@/lib/forecast/bands';
import {
  CHANNEL_LABEL, dispatchById, funnel, listDispatches, planIssuance,
  type ChannelOutcome, type DispatchRecord, type DispatchState,
} from '@/lib/dispatch/store';
import { Card, Eyebrow } from './Primitives';
import { Icon } from './Pictograms';

const n = (v: number) => v.toLocaleString('en-IN');

const STATE_LABEL: Record<DispatchState, { en: string; hi: string }> = {
  queued: { en: 'Queued for 05:30', hi: '5:30 के लिए कतार में' },
  sending: { en: 'Sending', hi: 'भेजा जा रहा है' },
  complete: { en: 'Complete', hi: 'पूर्ण' },
  partial: { en: 'Partially failed', hi: 'आंशिक विफल' },
};

const CHANNEL_ICON = {
  sms: <path d="M4 5h16v11H8l-4 4z" />,
  'ivr-hi': <path d="M6.5 4h3l1.5 4-2 1.5a11 11 0 0 0 5.5 5.5L16 13l4 1.5v3a2 2 0 0 1-2.3 2A16.5 16.5 0 0 1 4.5 6.3 2 2 0 0 1 6.5 4z" />,
  'ivr-mr': <path d="M6.5 4h3l1.5 4-2 1.5a11 11 0 0 0 5.5 5.5L16 13l4 1.5v3a2 2 0 0 1-2.3 2A16.5 16.5 0 0 1 4.5 6.3 2 2 0 0 1 6.5 4z" />,
} as const;

export function DispatchScreen() {
  const { t, locale, session, district } = useApp();
  const [openId, setOpenId] = useState<string | null>(null);
  const hi = locale === 'hi';
  const districtId = session?.districtId ?? district.id;
  const records = useMemo(() => listDispatches(districtId), [districtId]);

  if (session && session.role !== 'officer') {
    return (
      <Card className="p-6 text-center">
        <p className={`text-base-content/70 ${dv(locale)}`}>
          {hi ? 'यह स्क्रीन केवल ज़िला अधिकारी के लिए है।' : 'This screen is for district officers only.'}
        </p>
      </Card>
    );
  }

  if (openId) {
    const rec = dispatchById(openId);
    if (rec) return <DispatchDetail record={rec} onBack={() => setOpenId(null)} />;
  }

  const f = funnel(records);
  const rows: Array<[string, number, number]> = [
    [t.fTargeted, f.targeted, 100],
    [t.fDispatched, f.dispatched, f.targeted ? (f.dispatched / f.targeted) * 100 : 0],
    [t.fDelivered, f.delivered, f.targeted ? (f.delivered / f.targeted) * 100 : 0],
    [t.fAnswered, f.answered, f.targeted ? (f.answered / f.targeted) * 100 : 0],
    [t.fCompleted, f.completed, f.targeted ? (f.completed / f.targeted) * 100 : 0],
  ];

  return (
    <>
      <div>
        <Eyebrow className={dv(locale)}>{t.dispatchEyebrow}</Eyebrow>
        <h1 className={`mt-1 font-display text-[26px] font-extrabold tracking-tight ${dv(locale)}`}>{t.dispatchTitle}</h1>
        <p className={`mt-1 text-[13.5px] leading-relaxed text-base-content/70 ${dv(locale)}`}>{t.dispatchSub}</p>
      </div>

      {/* ── issuance funnel across every alert in this district — FR-6.8 ── */}
      <Card className="p-5">
        <div className="flex items-baseline justify-between gap-2.5">
          <Eyebrow className={dv(locale)}>{t.fTitle}</Eyebrow>
          <span className="font-display text-[11px] font-extrabold text-base-content/55">
            {records.length} {records.length === 1 ? t.alert : t.alerts}
          </span>
        </div>
        <div className="mt-3.5 flex flex-col gap-2">
          {rows.map(([label, value, pct]) => (
            <div key={label} className="flex items-center gap-2.5">
              <span className={`w-24 shrink-0 text-[11.5px] font-bold ${dv(locale)}`}>{label}</span>
              <span className="h-5.5 flex-1 overflow-hidden rounded-[6px] bg-base-300">
                <span className="flex h-full items-center rounded-[6px] bg-neutral pl-2 transition-[width] duration-500"
                  style={{ width: `${Math.max(pct, 12)}%` }}>
                  <span className="font-display text-[11px] font-extrabold text-neutral-content">{n(value)}</span>
                </span>
              </span>
              <span className="w-9 shrink-0 text-right font-display text-[11.5px] font-extrabold">
                {Math.round(pct)}%
              </span>
            </div>
          ))}
        </div>
      </Card>

      {/* ── the three forms every alert is issued in — FR-4.1, FR-4.2 ── */}
      <Card className="p-5">
        <Eyebrow className={dv(locale)}>{t.issuedIn}</Eyebrow>
        <p className={`mt-1.5 text-[12.5px] leading-relaxed text-base-content/55 ${dv(locale)}`}>{t.issuedInNote}</p>
        <div className="mt-3.5 flex flex-col gap-2">
          {(['sms', 'ivr-hi', 'ivr-mr'] as const).map((ch) => {
            const total = records.reduce(
              (a, r) => a + (r.channels.find((c) => c.channel === ch)?.delivered ?? 0), 0);
            return (
              <div key={ch} className="flex items-center gap-3 rounded-field bg-base-300 px-3.5 py-2.75
                ring-1 ring-base-content/10">
                <span className="grid size-8 shrink-0 place-items-center rounded-selector bg-primary/15 text-primary">
                  <Icon size={16} stroke={2.1}>{CHANNEL_ICON[ch]}</Icon>
                </span>
                <span className="min-w-0 flex-1">
                  <span className={`block text-[13px] font-extrabold ${dv(locale)}`}>
                    {hi ? CHANNEL_LABEL[ch].hi : CHANNEL_LABEL[ch].en}
                  </span>
                  <span className="block text-[11px] font-semibold text-base-content/55">
                    {CHANNEL_LABEL[ch].script}
                  </span>
                </span>
                <span className="font-display text-[14px] font-extrabold whitespace-nowrap">{n(total)}</span>
              </div>
            );
          })}
        </div>
      </Card>

      {/* ── history ── */}
      <div>
        <Eyebrow className={`mb-2.25 block ${dv(locale)}`}>{t.dispatchHistory}</Eyebrow>
        <Card>
          {records.map((r, idx) => {
            const sms = r.channels.find((c) => c.channel === 'sms');
            const reach = sms ? Math.round((sms.delivered / sms.targeted) * 100) : 0;
            return (
              <button key={r.id} onClick={() => setOpenId(r.id)}
                className={`flex w-full items-center gap-3.25 px-4 py-3.75 text-left ${
                  idx ? 'border-t border-base-content/10' : ''}`}>
                <span className="grid size-11 shrink-0 place-items-center rounded-selector font-display
                  text-[21px] font-black tracking-tighter"
                  style={{ background: bandFill(r.band), color: bandInk(r.band) }}>{r.band}</span>
                <span className="min-w-0 flex-1">
                  <span className="flex flex-wrap items-center gap-x-2 gap-y-1">
                    <span className={`text-[15.5px] font-extrabold tracking-tight ${dv(locale)}`}>
                      {hi ? r.blockHi : r.blockEn}
                    </span>
                    <StateBadge state={r.state} locale={locale} />
                  </span>
                  <span className="mt-0.5 block text-[12px] font-semibold text-base-content/55">
                    {r.dispatchedAt} · {n(sms?.targeted ?? 0)} {t.workers} · {reach}% {t.reached}
                  </span>
                </span>
                <Icon size={16} stroke={2.6} className="shrink-0 text-base-content/40"><path d="M9 6l6 6-6 6" /></Icon>
              </button>
            );
          })}
        </Card>
      </div>
    </>
  );
}

function StateBadge({ state, locale }: { state: DispatchState; locale: 'en' | 'hi' }) {
  const label = locale === 'hi' ? STATE_LABEL[state].hi : STATE_LABEL[state].en;
  const style =
    state === 'complete' ? 'bg-neutral text-neutral-content'
    : state === 'sending' ? 'bg-primary text-primary-content'
    : state === 'queued' ? 'ring-1.5 ring-base-content text-base-content'
    : 'stale-hatch bg-base-100 ring-1.5 ring-base-content text-base-content';
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[10.5px]
      font-extrabold ${style} ${dv(locale)}`}>{label}</span>
  );
}

function DispatchDetail({ record, onBack }: { record: DispatchRecord; onBack: () => void }) {
  const { t, locale } = useApp();
  const hi = locale === 'hi';
  const sms = record.channels.find((c) => c.channel === 'sms');
  const plan = planIssuance(record.districtId, sms?.targeted ?? 0);

  return (
    <>
      <button onClick={onBack}
        className="press surface flex min-h-10.5 items-center gap-2 self-start rounded-field px-4 text-[13.5px] font-extrabold">
        <Icon size={15} stroke={2.8}><path d="M15 6l-6 6 6 6" /></Icon>
        <span className={dv(locale)}>{t.back}</span>
      </button>

      <Card className="p-5">
        <div className="flex items-center justify-between gap-2.5">
          <Eyebrow className={dv(locale)}>{t.dispatchRecord}</Eyebrow>
          <span className="font-display text-[11px] font-extrabold text-base-content/55">{record.id}</span>
        </div>
        <div className="mt-3 flex items-center gap-3.5">
          <span className="grid size-12 shrink-0 place-items-center rounded-selector font-display
            text-[23px] font-black tracking-tighter"
            style={{ background: bandFill(record.band), color: bandInk(record.band) }}>{record.band}</span>
          <span className="min-w-0">
            <span className={`block text-[17px] font-extrabold tracking-tight ${dv(locale)}`}>
              {hi ? record.blockHi : record.blockEn} · {record.date}
            </span>
            <span className="mt-1 block"><StateBadge state={record.state} locale={locale} /></span>
          </span>
        </div>
        <p className={`mt-3.5 border-t border-base-content/10 pt-3 text-[12.5px] text-base-content/55 ${dv(locale)}`}>
          {t.dispatchedAt} <span className="font-display font-extrabold text-base-content">{record.dispatchedAt}</span>
          {' · '}{t.fromAdvisory} <span className="font-display font-extrabold">{record.advisoryId}</span>
        </p>
      </Card>

      {/* language routing — FR-5.1 preferred language drives which call they get */}
      <Card className="p-5">
        <Eyebrow className={dv(locale)}>{t.langRouting}</Eyebrow>
        <div className="mt-3 flex h-11 overflow-hidden rounded-selector ring-1 ring-base-content/10">
          <span className="flex items-center justify-center bg-primary text-primary-content"
            style={{ flex: plan.hindi }}>
            <span className={`text-[12px] font-extrabold ${dv(locale)}`}>
              {hi ? 'हिंदी' : 'Hindi'} {n(plan.hindi)}
            </span>
          </span>
          <span className="flex items-center justify-center bg-neutral text-neutral-content"
            style={{ flex: Math.max(plan.marwari, 1) }}>
            <span className={`text-[12px] font-extrabold ${dv(locale)}`}>
              {hi ? 'मारवाड़ी' : 'Marwari'} {n(plan.marwari)}
            </span>
          </span>
        </div>
        <p className={`mt-2.5 text-[12.5px] leading-relaxed text-base-content/55 ${dv(locale)}`}>{t.langRoutingNote}</p>
      </Card>

      {record.channels.map((c) => <ChannelCard key={c.channel} outcome={c} />)}

      {record.retries.length > 0 && (
        <Card>
          <div className="flex items-center justify-between gap-2.5 px-4 pt-4 pb-2.5">
            <Eyebrow className={dv(locale)}>{t.retryQueue}</Eyebrow>
            <span className="font-display text-[13px] font-extrabold">
              {n(record.retries.reduce((a, b) => a + b.count, 0))}
            </span>
          </div>
          {record.retries.map((b, idx) => (
            <div key={b.reasonEn} className={`flex items-center gap-3 px-4 py-3 ${
              idx ? 'border-t border-base-content/10' : ''}`}>
              <span className="min-w-0 flex-1">
                <span className={`block text-[13px] font-bold ${dv(locale)}`}>{hi ? b.reasonHi : b.reasonEn}</span>
                <span className="block text-[11px] font-semibold text-base-content/55">
                  {b.nextAttempt ? `${t.nextAttempt} ${b.nextAttempt}` : t.notRetried}
                </span>
              </span>
              <span className="font-display text-[14px] font-extrabold">{n(b.count)}</span>
            </div>
          ))}
          <div className="flex items-center justify-between gap-3 border-t border-base-content/10 bg-base-300 px-4 py-3">
            <span className={`text-[13px] font-bold ${dv(locale)}`}>{t.optOuts}</span>
            <span className="font-display text-[14px] font-extrabold">{n(record.optOuts)}</span>
          </div>
        </Card>
      )}
    </>
  );
}

function ChannelCard({ outcome: c }: { outcome: ChannelOutcome }) {
  const { t, locale } = useApp();
  const hi = locale === 'hi';
  const isVoice = c.channel !== 'sms';
  const pct = c.targeted ? Math.round((c.delivered / c.targeted) * 100) : 0;

  return (
    <Card className="p-5">
      <div className="flex items-center gap-3">
        <span className="grid size-9 shrink-0 place-items-center rounded-selector bg-primary/15 text-primary">
          <Icon size={18} stroke={2.1}>{CHANNEL_ICON[c.channel]}</Icon>
        </span>
        <span className="min-w-0 flex-1">
          <span className={`block text-[14.5px] font-extrabold tracking-tight ${dv(locale)}`}>
            {hi ? CHANNEL_LABEL[c.channel].hi : CHANNEL_LABEL[c.channel].en}
          </span>
          <span className="block text-[11px] font-semibold text-base-content/55">{CHANNEL_LABEL[c.channel].script}</span>
        </span>
        <span className="text-right">
          <span className="block font-display text-[22px] leading-none font-black tracking-tighter">{pct}%</span>
          <span className={`block text-[10.5px] font-bold text-base-content/55 ${dv(locale)}`}>
            {isVoice ? t.answered : t.delivered}
          </span>
        </span>
      </div>

      <dl className="mt-3.5 grid grid-cols-3 gap-x-3 gap-y-3 border-t border-base-content/10 pt-3.5">
        <Cell k={t.fTargeted} v={n(c.targeted)} />
        <Cell k={t.fDispatched} v={n(c.dispatched)} />
        <Cell k={isVoice ? t.answered : t.delivered} v={n(c.delivered)} />
        {isVoice && <Cell k={t.listened} v={n(c.completed ?? 0)} />}
        {isVoice && <Cell k={t.repeatKey} v={n(c.repeated ?? 0)} />}
        {!isVoice && <Cell k={t.segments} v={n(c.segments ?? 0)} />}
        <Cell k={t.failed} v={n(c.failed)} />
      </dl>

      {/* the two FRD defects, shown where they bite rather than buried in a doc */}
      {!isVoice && (
        <p className="mt-3 inline-flex items-center rounded-full px-2.75 py-1.5 text-[11px] font-extrabold
          text-warning ring-1.5 ring-warning">{t.ucs2Warn}</p>
      )}
      {isVoice && (c.durationSec ?? 0) > 30 && (
        <p className="mt-3 inline-flex items-center rounded-full px-2.75 py-1.5 text-[11px] font-extrabold
          text-warning ring-1.5 ring-warning">
          {c.durationSec}s {t.overCap}
        </p>
      )}
    </Card>
  );
}

function Cell({ k, v }: { k: string; v: string }) {
  const { locale } = useApp();
  return (
    <div className="flex flex-col gap-0.5">
      <dt className={`eyebrow ${dv(locale)}`}>{k}</dt>
      <dd className="font-display text-[15px] font-extrabold tracking-tight">{v}</dd>
    </div>
  );
}

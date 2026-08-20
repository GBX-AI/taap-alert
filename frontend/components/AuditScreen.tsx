'use client';

import { useEffect, useMemo, useState } from 'react';
import { useApp } from '@/lib/store';
import { dv } from '@/lib/i18n';
import { bandFill, bandInk, INTENSITY_LABELS } from '@/lib/forecast/bands';
import { auditById, contentDigest, listAudit, toCsv, type AdvisoryState, type AuditEntry } from '@/lib/audit/store';
import { Card, Eyebrow } from './Primitives';
import { Icon } from './Pictograms';

const STATE_LABEL: Record<AdvisoryState, { en: string; hi: string }> = {
  dispatched: { en: 'Dispatched', hi: 'भेजा गया' },
  'auto-dispatched': { en: 'Auto-dispatched · unreviewed', hi: 'स्वतः भेजा · अनदेखा' },
  rejected: { en: 'Rejected', hi: 'अस्वीकृत' },
  superseded: { en: 'Superseded', hi: 'प्रतिस्थापित' },
  'partially-failed': { en: 'Partially failed', hi: 'आंशिक विफल' },
};

/** State is drawn in ink only — never coloured, so it can never be read as risk. */
function StateBadge({ state, locale }: { state: AdvisoryState; locale: 'en' | 'hi' }) {
  const label = locale === 'hi' ? STATE_LABEL[state].hi : STATE_LABEL[state].en;
  const base = 'inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[10.5px] font-extrabold';
  const style =
    state === 'dispatched' ? 'bg-neutral text-neutral-content'
    : state === 'auto-dispatched' ? 'stale-hatch bg-base-100 ring-1.5 ring-base-content text-base-content'
    : state === 'rejected' ? 'ring-1.5 ring-base-content/40 text-base-content/55 line-through'
    : state === 'superseded' ? 'ring-1 ring-dashed ring-base-content/40 text-base-content/40'
    : 'ring-1.5 ring-base-content bg-base-300';
  return <span className={`${base} ${style} ${dv(locale)}`}>{label}</span>;
}

export function AuditScreen() {
  const { t, locale, session, district, say } = useApp();
  const [openId, setOpenId] = useState<string | null>(null);
  const hi = locale === 'hi';
  const rows = useMemo(() => listAudit(session?.districtId ?? district.id), [session, district.id]);

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
    const entry = auditById(openId);
    if (entry) return <AuditDetail entry={entry} onBack={() => setOpenId(null)} />;
  }

  function download(kind: 'csv' | 'json') {
    const body = kind === 'csv' ? toCsv(rows) : JSON.stringify(rows, null, 2);
    const blob = new Blob([body], { type: kind === 'csv' ? 'text/csv' : 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `taap-audit-${session?.districtId ?? district.id}.${kind}`;
    a.click();
    URL.revokeObjectURL(url);
    say(hi ? `${rows.length} रिकॉर्ड निर्यात किए` : `Exported ${rows.length} records`);
  }

  return (
    <>
      <div>
        <Eyebrow className={dv(locale)}>{t.auditEyebrow}</Eyebrow>
        <h1 className={`mt-1 font-display text-[26px] font-extrabold tracking-tight ${dv(locale)}`}>{t.auditTitle}</h1>
        <p className={`mt-1 text-[13.5px] leading-relaxed text-base-content/70 ${dv(locale)}`}>{t.auditSub}</p>
      </div>

      <div className="grid grid-cols-3 gap-2.5">
        <Stat label={t.auditRecords} value={String(rows.length)} />
        <Stat label={t.auditStale} value={String(rows.filter((r) => r.vintage.stale).length)} />
        <Stat label={t.auditRetention} value="5 yr" />
      </div>

      <Card>
        {rows.map((e, idx) => (
          <button key={e.id} onClick={() => setOpenId(e.id)}
            className={`flex w-full items-center gap-3.25 px-4 py-3.75 text-left ${
              idx ? 'border-t border-base-content/10' : ''}`}>
            <span className="relative grid size-11 shrink-0 place-items-center overflow-hidden rounded-selector
              font-display text-[21px] font-black tracking-tighter"
              style={{ background: bandFill(e.band), color: bandInk(e.band) }}>
              {e.vintage.stale && <span className="stale-hatch absolute inset-0" aria-hidden />}
              <span className="relative">{e.band}</span>
            </span>
            <span className="min-w-0 flex-1">
              <span className="flex flex-wrap items-center gap-x-2 gap-y-1">
                <span className={`text-[15.5px] font-extrabold tracking-tight ${dv(locale)}`}>
                  {hi ? e.blockHi : e.blockEn}
                </span>
                <StateBadge state={e.state} locale={locale} />
              </span>
              <span className="mt-0.5 block text-[12px] font-semibold text-base-content/55">
                {e.date} · {e.approvedBy ?? (hi ? '— स्वतः' : '— auto')} ·{' '}
                <span className={e.vintage.stale ? 'font-extrabold text-warning' : ''}>
                  {t.auditVintage} {e.vintage.sourceIssuedAt} · {e.vintage.ageHours} h
                </span>
              </span>
            </span>
            <Icon size={16} stroke={2.6} className="shrink-0 text-base-content/40"><path d="M9 6l6 6-6 6" /></Icon>
          </button>
        ))}
      </Card>

      <div className="flex gap-2.5">
        <button onClick={() => download('csv')}
          className="press surface flex min-h-13 flex-1 items-center justify-center gap-2 rounded-field text-sm font-extrabold">
          <Icon size={16} stroke={2.4}><path d="M12 4v11M8 11l4 4 4-4" /><path d="M4 20h16" /></Icon>
          <span className={dv(locale)}>{t.auditExportCsv}</span>
        </button>
        <button onClick={() => download('json')}
          className="press surface flex min-h-13 flex-1 items-center justify-center gap-2 rounded-field text-sm font-extrabold">
          <Icon size={16} stroke={2.4}><path d="M12 4v11M8 11l4 4 4-4" /><path d="M4 20h16" /></Icon>
          <span className={dv(locale)}>{t.auditExportJson}</span>
        </button>
      </div>

      <div className="flex items-start gap-2.5 rounded-field bg-base-300 px-3.5 py-3 ring-1 ring-base-content/10">
        <span className="mt-px shrink-0 text-base-content/40">
          <Icon size={15} stroke={2.2}><path d="M12 3l7 3v6c0 4.4-3 8.3-7 9.5C8 20.3 5 16.4 5 12V6z" /><path d="M9 12l2 2 4-4" /></Icon>
        </span>
        <span className={`text-[11.5px] leading-relaxed text-base-content/55 ${dv(locale)}`}>{t.auditImmutable}</span>
      </div>
    </>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  const { locale } = useApp();
  return (
    <Card className="flex flex-col gap-0.5 px-3.5 py-3.5">
      <span className="font-display text-[24px] leading-none font-black tracking-tighter">{value}</span>
      <span className={`text-[10.5px] leading-tight font-extrabold text-base-content/55 ${dv(locale)}`}>{label}</span>
    </Card>
  );
}

function AuditDetail({ entry, onBack }: { entry: AuditEntry; onBack: () => void }) {
  const { t, locale } = useApp();
  const [digest, setDigest] = useState<string | null>(null);
  const hi = locale === 'hi';

  useEffect(() => {
    let live = true;
    contentDigest(entry).then((d) => { if (live) setDigest(d); }).catch(() => setDigest(null));
    return () => { live = false; };
  }, [entry]);

  return (
    <>
      <button onClick={onBack}
        className="press surface flex min-h-10.5 items-center gap-2 self-start rounded-field px-4 text-[13.5px] font-extrabold">
        <Icon size={15} stroke={2.8}><path d="M15 6l-6 6 6 6" /></Icon>
        <span className={dv(locale)}>{t.back}</span>
      </button>

      <Card className="p-5">
        <div className="flex items-center justify-between gap-2.5">
          <Eyebrow className={dv(locale)}>{t.auditRecord}</Eyebrow>
          <span className="font-display text-[11px] font-extrabold text-base-content/55">{entry.id}</span>
        </div>
        <div className="mt-3 flex items-center gap-3.5">
          <span className="relative grid size-12 shrink-0 place-items-center overflow-hidden rounded-selector
            font-display text-[23px] font-black tracking-tighter"
            style={{ background: bandFill(entry.band), color: bandInk(entry.band) }}>
            {entry.vintage.stale && <span className="stale-hatch absolute inset-0" aria-hidden />}
            <span className="relative">{entry.band}</span>
          </span>
          <span className="min-w-0">
            <span className={`block text-[17px] font-extrabold tracking-tight ${dv(locale)}`}>
              {hi ? entry.blockHi : entry.blockEn} · {entry.date}
            </span>
            <span className="mt-1 block"><StateBadge state={entry.state} locale={locale} /></span>
          </span>
        </div>
      </Card>

      <Card className="p-5">
        <Eyebrow className={dv(locale)}>{t.auditVintageTitle}</Eyebrow>
        <dl className="mt-3 grid grid-cols-2 gap-x-4 gap-y-3">
          <Field k={t.auditSource} v={entry.vintage.sourceIssuedAt} />
          <Field k={t.auditAge} v={`${entry.vintage.ageHours} h`} warn={entry.vintage.stale} />
          <Field k={t.auditModelRun} v={entry.vintage.modelRun} />
          <Field k={t.auditRecipients} v={entry.recipients.toLocaleString('en-IN')} />
        </dl>
        {entry.vintage.stale && (
          <p className={`mt-3.5 flex items-start gap-2.5 rounded-field bg-base-300 px-3.5 py-3 text-[12.5px]
            leading-relaxed text-base-content/70 ${dv(locale)}`}>
            <span className="mt-px shrink-0 text-warning">
              <Icon size={16} stroke={2.3}><path d="M12 7.5v5.5M12 16.5v.4" /><circle cx="12" cy="12" r="8.6" /></Icon>
            </span>
            {t.staleWhy}
          </p>
        )}
      </Card>

      {entry.variants.length > 0 && (
        <Card className="p-5">
          <Eyebrow className={dv(locale)}>{t.auditVariants}</Eyebrow>
          <p className={`mt-1.5 text-[12.5px] leading-relaxed text-base-content/55 ${dv(locale)}`}>{t.auditVariantsNote}</p>
          <div className="mt-3 flex flex-wrap gap-2">
            {entry.variants.map((v) => (
              <span key={v} className={`rounded-full bg-base-300 px-3 py-1.5 text-[12px] font-extrabold
                ring-1 ring-base-content/10 ${dv(locale)}`}>
                {hi ? INTENSITY_LABELS[v].hi : INTENSITY_LABELS[v].en}
              </span>
            ))}
          </div>
        </Card>
      )}

      <Card className="p-5">
        <Eyebrow className={dv(locale)}>{t.auditChain}</Eyebrow>
        <ol className="mt-3.5 flex flex-col">
          {entry.chain.map((step, idx) => (
            <li key={idx} className="flex gap-3">
              <span className="flex w-3 flex-col items-center">
                <span className="size-2.25 shrink-0 rounded-[2px] bg-base-content" />
                {idx < entry.chain.length - 1 && <span className="w-px flex-1 bg-base-content/20" />}
              </span>
              <span className={`flex flex-col gap-0.5 ${idx < entry.chain.length - 1 ? 'pb-3.5' : ''}`}>
                <span className="text-[13px] font-extrabold tracking-tight">{step.label}</span>
                <span className="text-[12px] leading-snug text-base-content/55">{step.detail}</span>
                <span className="font-display text-[11px] font-bold text-base-content/40">{step.at}</span>
              </span>
            </li>
          ))}
        </ol>
      </Card>

      {entry.reason && (
        <Card className="p-5">
          <Eyebrow className={dv(locale)}>{t.auditReason}</Eyebrow>
          <p className={`mt-2 text-[13.5px] leading-relaxed text-base-content/70 ${dv(locale)}`}>{entry.reason}</p>
        </Card>
      )}

      {entry.content.smsHindi !== '—' && (
        <Card className="p-5">
          <Eyebrow className={dv(locale)}>{t.auditContent}</Eyebrow>
          <p className="mt-2.75 rounded-field bg-base-300 px-4 py-3.5 font-dv text-[14px] ring-1 ring-base-content/10">
            {entry.content.smsHindi}
          </p>
          <p className="mt-2.5 rounded-field border-l-3 border-primary bg-base-300 px-4 py-3.5 font-dv text-[14px]">
            {entry.content.ivrMarwari}
          </p>
          <p className="mt-3 flex flex-wrap items-baseline gap-2">
            <span className="eyebrow">sha-256</span>
            <span className="font-display text-[11px] font-bold break-all text-base-content/55">
              {digest ? `${digest.slice(0, 16)}…${digest.slice(-8)}` : '…'}
            </span>
          </p>
        </Card>
      )}
    </>
  );
}

function Field({ k, v, warn }: { k: string; v: string; warn?: boolean }) {
  const { locale } = useApp();
  return (
    <div className="flex flex-col gap-0.5">
      <dt className={`eyebrow ${dv(locale)}`}>{k}</dt>
      <dd className={`font-display text-[15px] font-extrabold tracking-tight ${warn ? 'text-warning' : ''}`}>{v}</dd>
    </div>
  );
}

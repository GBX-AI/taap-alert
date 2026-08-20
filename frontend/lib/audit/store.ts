import type { Band } from '../forecast/model';
import type { Intensity } from '../forecast/bands';

/**
 * Advisory audit trail — FR-7.1, FR-7.2, AC-8.
 *
 * Every advisory that is issued, rejected or superseded lands here, together
 * with **the data vintage it was built on**. That last part is the one the FRD
 * is emphatic about and the one systems usually omit: when an advisory is
 * questioned months later, "what did we know, and how old was it?" is the
 * question, and it cannot be reconstructed after the fact.
 *
 * Entries are append-only. Editing a dispatched advisory creates a new record
 * and marks the old one superseded; nothing is rewritten in place.
 *
 * This implementation keeps the log in memory for the prototype. Production
 * needs durable storage with a 5-year retention floor (NFR-8) and a signed
 * export (FR-7.2).
 */

export type AdvisoryState =
  | 'dispatched'
  | 'auto-dispatched'
  | 'rejected'
  | 'superseded'
  | 'partially-failed';

export interface Vintage {
  /** Issue time of the source forecast the advisory was built from. */
  sourceIssuedAt: string;
  /** Age of that source at the moment the band was computed. */
  ageHours: number;
  /** Identifier of the downscaling model run. */
  modelRun: string;
  /** True when the feed had aged past threshold and the band was raised (DP-2). */
  stale: boolean;
}

export interface ChainStep {
  label: string;
  detail: string;
  at: string;
}

export interface AuditEntry {
  id: string;
  blockId: string;
  blockEn: string;
  blockHi: string;
  districtId: string;
  /** Date the advisory covers. */
  date: string;
  band: Band;
  state: AdvisoryState;
  /** Null when the 19:00 cut-off passed without review and it auto-dispatched. */
  approvedBy: string | null;
  approvedAt: string | null;
  dispatchedAt: string | null;
  recipients: number;
  /** Which work-intensity variants were generated from this one advisory. */
  variants: Intensity[];
  vintage: Vintage;
  /** Exactly what went out, retained verbatim. */
  content: { smsHindi: string; ivrMarwari: string };
  /** Why it was rejected, when it was. */
  reason?: string;
  chain: ChainStep[];
}

const seed: AuditEntry[] = [
  {
    id: 'ADV-2026-08-20-PHL',
    blockId: 'phalodi', blockEn: 'Phalodi', blockHi: 'फलौदी', districtId: 'jodhpur',
    date: '20 Aug 2026', band: 4, state: 'dispatched',
    approvedBy: 'R. Bishnoi', approvedAt: '19 Aug 18:41', dispatchedAt: '20 Aug 05:30',
    recipients: 14208, variants: ['light', 'moderate', 'heavy'],
    vintage: { sourceIssuedAt: '19 Aug 04:00', ageHours: 2, modelRun: 'm-2026.08.14', stale: false },
    content: {
      smsHindi: 'फलौदी: कल बहुत अधिक गर्मी। 11:00 से 17:00 तक भारी काम न करें। 500 मि.ली. पानी हर 20 मिनट। राजकीय उच्च माध्यमिक विद्यालय में छाया और पानी।',
      ivrMarwari: 'रामरामसा। फलौदी में काल बौत घणी गरमी रैवैला। 11:00 सूं 17:00 तांई भारी काम मती करो।',
    },
    chain: [
      { label: 'Open-Meteo IFS issue', detail: 'ECMWF IFS + ICON, 0.1°', at: '19 Aug 04:00' },
      { label: 'Downscale run m-2026.08.14', detail: '62 min · 0 gaps · 136 units published', at: '19 Aug 05:02' },
      { label: 'Band 4 assigned', detail: 'feels 51.2° · normal 46.9° · departure +4.3° · acclimatisation high', at: '19 Aug 05:04' },
      { label: 'Approved by R. Bishnoi', detail: 'SSO RAJ-8841 · 3 variants reviewed', at: '19 Aug 18:41' },
      { label: 'Dispatched', detail: '14,208 recipients · IVR + SMS', at: '20 Aug 05:30' },
    ],
  },
  {
    id: 'ADV-2026-08-20-BAP',
    blockId: 'bap', blockEn: 'Bap', blockHi: 'बाप', districtId: 'jodhpur',
    date: '20 Aug 2026', band: 4, state: 'auto-dispatched',
    approvedBy: null, approvedAt: null, dispatchedAt: '20 Aug 05:30',
    recipients: 6940, variants: ['light', 'moderate', 'heavy'],
    vintage: { sourceIssuedAt: '19 Aug 04:00', ageHours: 2, modelRun: 'm-2026.08.14', stale: false },
    content: {
      smsHindi: 'बाप: कल बहुत अधिक गर्मी। भारी काम न करें। 500 मि.ली. पानी हर 20 मिनट।',
      ivrMarwari: 'रामरामसा। बाप में काल बौत घणी गरमी रैवैला।',
    },
    chain: [
      { label: 'Open-Meteo IFS issue', detail: 'ECMWF IFS + ICON, 0.1°', at: '19 Aug 04:00' },
      { label: 'Downscale run m-2026.08.14', detail: '62 min · 0 gaps', at: '19 Aug 05:02' },
      { label: 'Band 4 assigned', detail: 'departure +4.1° · acclimatisation high', at: '19 Aug 05:04' },
      { label: 'Cut-off passed unreviewed', detail: 'escalated to State Administrator at 19:00', at: '19 Aug 19:00' },
      { label: 'Auto-dispatched, flagged unreviewed', detail: 'silence would breach DP-2', at: '20 Aug 05:30' },
    ],
  },
  {
    id: 'ADV-2026-08-20-SHG',
    blockId: 'shergarh', blockEn: 'Shergarh', blockHi: 'शेरगढ़', districtId: 'jodhpur',
    date: '20 Aug 2026', band: 4, state: 'dispatched',
    approvedBy: 'R. Bishnoi', approvedAt: '19 Aug 18:52', dispatchedAt: '20 Aug 05:30',
    recipients: 8612, variants: ['light', 'moderate', 'heavy'],
    vintage: { sourceIssuedAt: '18 Aug 16:00', ageHours: 14, modelRun: 'm-2026.08.14', stale: true },
    content: {
      smsHindi: 'शेरगढ़: कल बहुत अधिक गर्मी। भारी काम न करें। 500 मि.ली. पानी हर 20 मिनट।',
      ivrMarwari: 'रामरामसा। शेरगढ़ में काल बौत घणी गरमी रैवैला।',
    },
    chain: [
      { label: 'IMD AWS feed timed out', detail: 'gateway unreachable · last observation 18 Aug 16:00', at: '19 Aug 03:40' },
      { label: 'Downscale run m-2026.08.14', detail: 'ran on Open-Meteo alone · IMD ground truth absent', at: '19 Aug 05:02' },
      { label: 'Band 3 computed, raised to 4', detail: 'DP-2 · input aged 14 h past threshold · never lowered', at: '19 Aug 05:04' },
      { label: 'Approved by R. Bishnoi', detail: 'SSO RAJ-8841 · stale-data caution acknowledged', at: '19 Aug 18:52' },
      { label: 'Dispatched', detail: '8,612 recipients · IVR + SMS', at: '20 Aug 05:30' },
    ],
  },
  {
    id: 'ADV-2026-08-19-OSN',
    blockId: 'osian', blockEn: 'Osian', blockHi: 'ओसियाँ', districtId: 'jodhpur',
    date: '19 Aug 2026', band: 4, state: 'rejected',
    approvedBy: 'S. Choudhary', approvedAt: '18 Aug 17:20', dispatchedAt: null,
    recipients: 0, variants: [],
    vintage: { sourceIssuedAt: '18 Aug 04:00', ageHours: 3, modelRun: 'm-2026.08.14', stale: false },
    content: { smsHindi: '—', ivrMarwari: '—' },
    reason: 'Local mela — work hours already shifted by the panchayat; advisory would have conflicted.',
    chain: [
      { label: 'Downscale run m-2026.08.14', detail: '58 min · 0 gaps', at: '18 Aug 05:01' },
      { label: 'Band 4 assigned', detail: 'departure +6.8° · acclimatisation medium', at: '18 Aug 05:03' },
      { label: 'Rejected by S. Choudhary', detail: 'SSO RAJ-2207 · reason recorded', at: '18 Aug 17:20' },
    ],
  },
  {
    id: 'ADV-2026-08-19-PHL',
    blockId: 'phalodi', blockEn: 'Phalodi', blockHi: 'फलौदी', districtId: 'jodhpur',
    date: '19 Aug 2026', band: 3, state: 'superseded',
    approvedBy: 'R. Bishnoi', approvedAt: '18 Aug 16:10', dispatchedAt: null,
    recipients: 0, variants: [],
    vintage: { sourceIssuedAt: '18 Aug 04:00', ageHours: 12, modelRun: 'm-2026.08.13', stale: false },
    content: { smsHindi: '—', ivrMarwari: '—' },
    reason: 'Superseded at 17:42 when the 16:00 model run raised the band to 4. Band worsened after approval, so it re-issued rather than dispatching the stale grade.',
    chain: [
      { label: 'Downscale run m-2026.08.13', detail: '61 min', at: '18 Aug 05:00' },
      { label: 'Band 3 assigned', detail: 'departure +3.9°', at: '18 Aug 05:02' },
      { label: 'Approved by R. Bishnoi', detail: 'SSO RAJ-8841', at: '18 Aug 16:10' },
      { label: 'Superseded by ADV-2026-08-19-PHL-R2', detail: 'intraday run raised band 3 → 4', at: '18 Aug 17:42' },
    ],
  },
];

const entries: AuditEntry[] = [...seed];

export function listAudit(districtId?: string): AuditEntry[] {
  return districtId ? entries.filter((e) => e.districtId === districtId) : entries;
}

export function auditById(id: string): AuditEntry | undefined {
  return entries.find((e) => e.id === id);
}

/** Called when an advisory is approved. Append-only. */
export function recordApproval(entry: Omit<AuditEntry, 'chain'> & { chain?: ChainStep[] }) {
  entries.unshift({
    ...entry,
    chain: entry.chain ?? [
      { label: `Downscale run ${entry.vintage.modelRun}`, detail: 'graded from the current run', at: entry.vintage.sourceIssuedAt },
      {
        label: `Band ${entry.band} assigned`,
        detail: entry.vintage.stale
          ? 'raised one band — source aged past threshold (DP-2)'
          : 'anomaly-relative grading',
        at: entry.vintage.sourceIssuedAt,
      },
      {
        label: entry.approvedBy ? `Approved by ${entry.approvedBy}` : 'Auto-dispatched, unreviewed',
        detail: `${entry.variants.length} work-intensity variants issued`,
        at: entry.approvedAt ?? '19:00 cut-off',
      },
      { label: 'Scheduled for dispatch', detail: `${entry.recipients.toLocaleString('en-IN')} recipients · IVR + SMS`, at: '05:30' },
    ],
  });
}

/** SHA-256 over the exact content issued, so a record can be shown to be unaltered. */
export async function contentDigest(entry: AuditEntry): Promise<string> {
  const payload = `${entry.id}|${entry.band}|${entry.content.smsHindi}|${entry.content.ivrMarwari}`;
  const bytes = new TextEncoder().encode(payload);
  const hash = await crypto.subtle.digest('SHA-256', bytes);
  return Array.from(new Uint8Array(hash))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
}

const CSV_COLUMNS = [
  'advisory_id', 'date', 'district', 'block', 'band', 'state',
  'approved_by', 'approved_at', 'dispatched_at', 'recipients', 'variants',
  'source_issued_at', 'source_age_hours', 'model_run', 'stale_input', 'reason',
];

/** FR-7.2 — exportable for a district and date range. */
export function toCsv(rows: AuditEntry[]): string {
  const esc = (v: unknown) => {
    const s = String(v ?? '');
    return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
  };
  const lines = rows.map((e) =>
    [
      e.id, e.date, e.districtId, e.blockEn, e.band, e.state,
      e.approvedBy ?? '', e.approvedAt ?? '', e.dispatchedAt ?? '', e.recipients,
      e.variants.join(' '),
      e.vintage.sourceIssuedAt, e.vintage.ageHours, e.vintage.modelRun, e.vintage.stale,
      e.reason ?? '',
    ].map(esc).join(','),
  );
  return [CSV_COLUMNS.join(','), ...lines].join('\n');
}

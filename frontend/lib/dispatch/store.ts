import type { Band } from '../forecast/model';

/**
 * Alert issuance and delivery history — FR-4.1, FR-4.2, FR-4.9, FR-4.11, FR-6.8.
 *
 * One approved advisory is issued in THREE forms, not one:
 *   · SMS in Devanagari (Hindi)          — FR-4.9
 *   · IVR voice in Hindi                 — FR-4.2
 *   · IVR voice in Marwari               — FR-4.2, FR-4.3
 *
 * Both IVR languages are mandatory, and Marwari cannot come from Bhashini
 * (it is not one of the 22 scheduled languages), so it plays from a recorded
 * native-speaker prompt bank assembled at call time.
 *
 * Recipients are routed by the preferred-language field on their registry
 * record (FR-5.1). Everyone gets the SMS; the voice call they receive depends
 * on that field.
 */

export type Channel = 'sms' | 'ivr-hi' | 'ivr-mr';
export type DispatchState = 'queued' | 'sending' | 'complete' | 'partial';

export interface ChannelOutcome {
  channel: Channel;
  language: 'hi' | 'mr';
  targeted: number;
  /** Handed to the aggregator. */
  dispatched: number;
  /** Confirmed delivered (SMS) or answered (IVR). */
  delivered: number;
  /** Listened to the end — IVR only. */
  completed?: number;
  /** Pressed the repeat key — IVR only, FR-4.6. */
  repeated?: number;
  failed: number;
  /** Billable SMS segments — Devanagari is UCS-2, so 67 chars per segment. */
  segments?: number;
  /** Seconds of audio per call — FR-4.5 caps this at 30. */
  durationSec?: number;
}

export interface RetryBucket {
  reasonEn: string;
  reasonHi: string;
  count: number;
  /** Absent when the bucket is not retried at all. */
  nextAttempt?: string;
}

export interface DispatchRecord {
  id: string;
  advisoryId: string;
  blockId: string;
  blockEn: string;
  blockHi: string;
  districtId: string;
  date: string;
  band: Band;
  dispatchedAt: string;
  state: DispatchState;
  channels: ChannelOutcome[];
  retries: RetryBucket[];
  optOuts: number;
}

/* Marwari is the first language across the Marwar region; elsewhere in
   Rajasthan the share falls away sharply. Routing follows that. */
const MARWAR = new Set([
  'jodhpur', 'pali', 'nagaur', 'barmer', 'jaisalmer', 'jalore', 'sirohi', 'bikaner',
]);

export const marwariShare = (districtId: string) => (MARWAR.has(districtId) ? 0.62 : 0.08);

/** Split a block's recipients across the three issued forms. */
export function planIssuance(districtId: string, recipients: number) {
  const mr = Math.round(recipients * marwariShare(districtId));
  const hi = recipients - mr;
  return { total: recipients, hindi: hi, marwari: mr };
}

function outcomes(districtId: string, recipients: number, complete: boolean): ChannelOutcome[] {
  const { hindi, marwari } = planIssuance(districtId, recipients);
  const f = complete ? 1 : 0.42; // a dispatch still in flight has only partial numbers
  const r = (n: number) => Math.round(n * f);
  return [
    {
      channel: 'sms', language: 'hi',
      targeted: recipients,
      dispatched: r(Math.round(recipients * 0.97)),
      delivered: r(Math.round(recipients * 0.91)),
      failed: r(Math.round(recipients * 0.06)),
      segments: r(Math.round(recipients * 0.91) * 2), // 129 chars → 2 UCS-2 segments
    },
    {
      channel: 'ivr-hi', language: 'hi',
      targeted: hindi,
      dispatched: r(Math.round(hindi * 0.96)),
      delivered: r(Math.round(hindi * 0.63)),
      completed: r(Math.round(hindi * 0.49)),
      repeated: r(Math.round(hindi * 0.11)),
      failed: r(Math.round(hindi * 0.33)),
      durationSec: 32,
    },
    {
      channel: 'ivr-mr', language: 'mr',
      targeted: marwari,
      dispatched: r(Math.round(marwari * 0.96)),
      delivered: r(Math.round(marwari * 0.68)),
      completed: r(Math.round(marwari * 0.56)),
      repeated: r(Math.round(marwari * 0.14)),
      failed: r(Math.round(marwari * 0.28)),
      durationSec: 34,
    },
  ];
}

function retries(recipients: number): RetryBucket[] {
  return [
    {
      reasonEn: 'Unreachable — retry 1 of 2', reasonHi: 'संपर्क नहीं — 2 में से 1 प्रयास',
      count: Math.round(recipients * 0.052), nextAttempt: '06:12',
    },
    {
      reasonEn: 'Switched off — retry 2 of 2', reasonHi: 'बंद — 2 में से 2 प्रयास',
      count: Math.round(recipients * 0.021), nextAttempt: '06:42',
    },
    {
      reasonEn: 'Invalid number — flagged to registry', reasonHi: 'ग़लत नंबर — रजिस्ट्री को भेजा',
      count: Math.round(recipients * 0.014),
    },
    {
      reasonEn: 'Suppressed — consent absent', reasonHi: 'रोका गया — सहमति नहीं',
      count: Math.round(recipients * 0.005),
    },
  ].filter((b) => b.count > 0);
}

const seed: DispatchRecord[] = [
  {
    id: 'DSP-2026-08-20-PHL', advisoryId: 'ADV-2026-08-20-PHL',
    blockId: 'phalodi', blockEn: 'Phalodi', blockHi: 'फलौदी', districtId: 'jodhpur',
    date: '20 Aug 2026', band: 4, dispatchedAt: '20 Aug 05:30', state: 'complete',
    channels: outcomes('jodhpur', 14208, true), retries: retries(14208), optOuts: 61,
  },
  {
    id: 'DSP-2026-08-20-SHG', advisoryId: 'ADV-2026-08-20-SHG',
    blockId: 'shergarh', blockEn: 'Shergarh', blockHi: 'शेरगढ़', districtId: 'jodhpur',
    date: '20 Aug 2026', band: 4, dispatchedAt: '20 Aug 05:30', state: 'partial',
    channels: outcomes('jodhpur', 8612, true), retries: retries(8612), optOuts: 34,
  },
  {
    id: 'DSP-2026-08-20-BAP', advisoryId: 'ADV-2026-08-20-BAP',
    blockId: 'bap', blockEn: 'Bap', blockHi: 'बाप', districtId: 'jodhpur',
    date: '20 Aug 2026', band: 4, dispatchedAt: '20 Aug 05:30', state: 'complete',
    channels: outcomes('jodhpur', 6940, true), retries: retries(6940), optOuts: 22,
  },
  {
    id: 'DSP-2026-08-19-BAL', advisoryId: 'ADV-2026-08-19-BAL',
    blockId: 'balesar', blockEn: 'Balesar', blockHi: 'बालेसर', districtId: 'jodhpur',
    date: '19 Aug 2026', band: 3, dispatchedAt: '19 Aug 05:30', state: 'complete',
    channels: outcomes('jodhpur', 5104, true), retries: retries(5104), optOuts: 18,
  },
];

const records: DispatchRecord[] = [...seed];

export const listDispatches = (districtId?: string) =>
  districtId ? records.filter((r) => r.districtId === districtId) : records;

export const dispatchById = (id: string) => records.find((r) => r.id === id);

/** Called when an advisory is approved — the alert enters the outbound queue. */
export function queueDispatch(args: {
  advisoryId: string; blockId: string; blockEn: string; blockHi: string;
  districtId: string; date: string; band: Band; recipients: number;
}) {
  records.unshift({
    id: args.advisoryId.replace('ADV', 'DSP'),
    advisoryId: args.advisoryId,
    blockId: args.blockId, blockEn: args.blockEn, blockHi: args.blockHi,
    districtId: args.districtId, date: args.date, band: args.band,
    dispatchedAt: '21 Aug 05:30', state: 'queued',
    channels: outcomes(args.districtId, args.recipients, false),
    retries: [], optOuts: 0,
  });
}

/* ── roll-ups for the summary strip (FR-6.8) ── */
export const sum = (rs: DispatchRecord[], pick: (c: ChannelOutcome) => number | undefined) =>
  rs.reduce((a, r) => a + r.channels.reduce((b, c) => b + (pick(c) ?? 0), 0), 0);

export function funnel(rs: DispatchRecord[]) {
  const targeted = sum(rs, (c) => (c.channel === 'sms' ? c.targeted : 0));
  return {
    targeted,
    dispatched: sum(rs, (c) => (c.channel === 'sms' ? c.dispatched : 0)),
    delivered: sum(rs, (c) => (c.channel === 'sms' ? c.delivered : 0)),
    answered: sum(rs, (c) => (c.channel === 'sms' ? 0 : c.delivered)),
    completed: sum(rs, (c) => c.completed),
  };
}

export const CHANNEL_LABEL: Record<Channel, { en: string; hi: string; script: string }> = {
  sms: { en: 'SMS · Hindi', hi: 'एसएमएस · हिंदी', script: 'Devanagari' },
  'ivr-hi': { en: 'Voice call · Hindi', hi: 'वॉइस कॉल · हिंदी', script: 'Bhashini TTS' },
  'ivr-mr': { en: 'Voice call · Marwari', hi: 'वॉइस कॉल · मारवाड़ी', script: 'Recorded prompt bank' },
};

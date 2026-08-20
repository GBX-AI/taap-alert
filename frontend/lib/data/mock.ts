import { gradeDay, type DayForecast } from '../forecast/model';
import { ALL_BLOCKS, DISTRICTS, blockById } from './districts';
import type { DataProvider, DayMeta, QueueItem, Shelter } from './provider';

/** Fixed reference date so the demo is deterministic — no Date.now() anywhere. */
export const DAYS: DayMeta[] = [
  { index: 0, en: 'Today', hi: 'आज', date: '20 Aug', confidence: 'High' },
  { index: 1, en: 'Fri', hi: 'शुक्र', date: '21 Aug', confidence: 'High' },
  { index: 2, en: 'Sat', hi: 'शनि', date: '22 Aug', confidence: 'Medium' },
  { index: 3, en: 'Sun', hi: 'रवि', date: '23 Aug', confidence: 'Low' },
];

const DAY_OFFSET_C = [0, 1.4, 0.3, -2.4];

const SHELTERS: Shelter[] = [
  { id: 'sh-school-phalodi', en: 'Govt Sr Sec School', hi: 'राजकीय उच्च माध्यमिक विद्यालय',
    place: 'Phalodi', distance: '800 m', hours: '10:00–18:00', capacity: 400, open: true },
  { id: 'sh-panchayat-bhikamkor', en: 'Panchayat Bhawan', hi: 'पंचायत भवन',
    place: 'Bhikamkor', distance: '1.6 km', hours: '11:00–17:00', capacity: 150, open: false },
  { id: 'sh-hall-dhelana', en: 'Community Hall', hi: 'सामुदायिक भवन',
    place: 'Dhelana', distance: '3.4 km', hours: '11:00–17:00', capacity: 220, open: false },
  { id: 'sh-mandi-osian', en: 'Krishi Upaj Mandi', hi: 'कृषि उपज मंडी',
    place: 'Osian', distance: '6.1 km', hours: '09:00–19:00', capacity: 500, open: true },
];

const shelterState = new Map(SHELTERS.map((s) => [s.id, s.open]));
const approved = new Set<string>();
const QUEUE_BLOCKS = ['phalodi', 'shergarh', 'balesar', 'luni'];

const cache = new Map<string, DayForecast>();

/** Synchronous grading — the UI renders from this without a loading state. */
export function forecastFor(blockId: string, day: number): DayForecast {
  const key = `${blockId}|${day}`;
  const hit = cache.get(key);
  if (hit) return hit;
  const block = blockById(blockId) ?? ALL_BLOCKS[0];
  const graded = gradeDay(block.climate, DAY_OFFSET_C[day] ?? 0);
  cache.set(key, graded);
  return graded;
}

export function sheltersFor(_blockId: string): Shelter[] {
  return SHELTERS.map((s) => ({ ...s, open: shelterState.get(s.id) ?? s.open }));
}

export function queueFor(districtId: string): QueueItem[] {
  return QUEUE_BLOCKS.filter(
    (id) => !approved.has(id) && blockById(id)?.districtId === districtId,
  ).map((id) => ({
    blockId: id,
    day: 1,
    recipients: forecastFor(id, 1).maxBand * 2840,
  }));
}

export function markApproved(ids: string[]) {
  ids.forEach((id) => approved.add(id));
}

export function toggleShelter(id: string, open: boolean) {
  shelterState.set(id, open);
}

export const mockDataProvider: DataProvider = {
  async listDistricts() { return DISTRICTS; },
  async listDays() { return DAYS; },
  async getForecast(blockId, day) { return forecastFor(blockId, day); },
  async listShelters(blockId) { return sheltersFor(blockId); },
  async setShelterOpen(id, open) { toggleShelter(id, open); },
  async listApprovalQueue(districtId) { return queueFor(districtId); },
  async approve(ids) { markApproved(ids); },
};

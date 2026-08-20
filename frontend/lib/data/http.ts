import type { DayForecast } from '../forecast/model';
import type { District } from './districts';
import { API_BASE_URL, type DataProvider, type DayMeta, type QueueItem, type Shelter } from './provider';

/**
 * Real-backend implementation. Not exercised in the prototype — every method
 * is a thin fetch against the FastAPI service in FRD §10.1, kept here so the
 * contract is visible and the swap is a config change, not a rewrite.
 *
 * Enable with NEXT_PUBLIC_DATA_SOURCE=http and NEXT_PUBLIC_API_BASE_URL=...
 */
async function get<T>(path: string): Promise<T> {
  const res = await fetch(`${API_BASE_URL}${path}`, {
    headers: { accept: 'application/json' },
  });
  if (!res.ok) throw new Error(`${path} → ${res.status}`);
  return res.json() as Promise<T>;
}

async function send(path: string, body: unknown): Promise<void> {
  const res = await fetch(`${API_BASE_URL}${path}`, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify(body),
  });
  if (!res.ok) throw new Error(`${path} → ${res.status}`);
}

export const httpDataProvider: DataProvider = {
  listDistricts: () => get<District[]>('/v1/units/districts'),
  listDays: () => get<DayMeta[]>('/v1/forecast/days'),
  getForecast: (blockId, day) => get<DayForecast>(`/v1/forecast/${blockId}?day=${day}`),
  listShelters: (blockId) => get<Shelter[]>(`/v1/shelters?block=${blockId}`),
  setShelterOpen: (id, open) => send(`/v1/shelters/${id}/status`, { open }),
  listApprovalQueue: (districtId) => get<QueueItem[]>(`/v1/advisories/queue?district=${districtId}`),
  approve: (blockIds) => send('/v1/advisories/approve', { blockIds }),
};

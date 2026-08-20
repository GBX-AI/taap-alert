import type { DayForecast } from '../forecast/model';
import type { Block, District } from './districts';

/**
 * The seam between this app and the forecast platform.
 *
 * Nothing in `app/` or `components/` may import mock data directly — they go
 * through this interface. Swapping the prototype for the real system is then
 * one implementation, selected by NEXT_PUBLIC_DATA_SOURCE, with no UI changes.
 *
 * The HTTP implementation targets the FastAPI service described in FRD §10.1.
 */

export interface DayMeta {
  /** 0 = today. */
  index: number;
  en: string;
  hi: string;
  /** e.g. "20 Aug" */
  date: string;
  /** Confidence degrades with lead time — FR-2.7, FR-2.13. */
  confidence: 'High' | 'Medium' | 'Low';
}

export interface Shelter {
  id: string;
  en: string;
  hi: string;
  place: string;
  /** Walking distance as displayed, e.g. "800 m". */
  distance: string;
  hours: string;
  capacity: number;
  /** Recorded as actually open by someone in the field — FR-6.3 feedback loop. */
  open: boolean;
}

export interface QueueItem {
  blockId: string;
  /** Day index the advisory covers. */
  day: number;
  recipients: number;
}

export interface DataProvider {
  listDistricts(): Promise<District[]>;
  listDays(): Promise<DayMeta[]>;
  /** Graded forecast for one block on one day. */
  getForecast(blockId: string, day: number): Promise<DayForecast>;
  listShelters(blockId: string): Promise<Shelter[]>;
  setShelterOpen(shelterId: string, open: boolean): Promise<void>;
  /** Advisories awaiting district-officer approval — FR-6.5. */
  listApprovalQueue(districtId: string): Promise<QueueItem[]>;
  approve(blockIds: string[]): Promise<void>;
}

export type DataSource = 'mock' | 'http';

export const DATA_SOURCE: DataSource =
  (process.env.NEXT_PUBLIC_DATA_SOURCE as DataSource) ?? 'mock';

export const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL ?? '';

/** Resolved lazily so the mock bundle is not pulled into an HTTP-only build. */
export async function getDataProvider(): Promise<DataProvider> {
  if (DATA_SOURCE === 'http') {
    const { httpDataProvider } = await import('./http');
    return httpDataProvider;
  }
  const { mockDataProvider } = await import('./mock');
  return mockDataProvider;
}

export type { Block, District };

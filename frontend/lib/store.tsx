'use client';

import {
  createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode,
} from 'react';
import { type Band, type DayForecast } from './forecast/model';
import { BANDS, type BandGuidance } from './forecast/bands';
import { ALL_BLOCKS, DISTRICTS, blockById, districtById, type Block, type District } from './data/districts';
import { DAYS, forecastFor, markApproved, queueFor, sheltersFor, toggleShelter } from './data/mock';
import type { DayMeta, QueueItem, Shelter } from './data/provider';
import { clearSession, loadSession, saveSession, type Session } from './auth/provider';
import { DICT, type Locale } from './i18n';

export type Theme = 'taap' | 'taap-dark';
export type MapMode = 'risk' | 'heat';

interface Store {
  locale: Locale; setLocale: (l: Locale) => void;
  t: (typeof DICT)['en'];
  theme: Theme; toggleTheme: () => void;

  session: Session | null;
  signIn: (s: Session) => void;
  signOut: () => void;

  day: number; setDay: (d: number) => void;
  hour: number; setHour: (h: number) => void;
  days: DayMeta[];

  block: Block; setBlock: (id: string) => void;
  district: District;
  districts: District[];

  forecast: DayForecast;
  band: Band;
  guidance: BandGuidance;

  mapMode: MapMode; setMapMode: (m: MapMode) => void;

  shelters: Shelter[];
  setShelterOpen: (id: string, open: boolean) => void;

  queue: QueueItem[];
  approve: (ids: string[]) => void;

  toast: string | null;
  say: (msg: string) => void;
}

const Ctx = createContext<Store | null>(null);

export function useApp(): Store {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error('useApp must be used inside <AppProvider>');
  return ctx;
}

export function AppProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>('en');
  const [theme, setTheme] = useState<Theme>('taap');
  const [session, setSession] = useState<Session | null>(null);
  const [day, setDay] = useState(0);
  const [hour, setHour] = useState(14);
  const [blockId, setBlockId] = useState('phalodi');
  const [mapMode, setMapMode] = useState<MapMode>('risk');
  const [tick, setTick] = useState(0);
  const [toast, setToast] = useState<string | null>(null);

  /* restore preferences */
  useEffect(() => {
    const s = loadSession();
    if (s) { setSession(s); setBlockId(s.blockId); }
    const savedLocale = window.localStorage.getItem('taap.locale') as Locale | null;
    if (savedLocale) setLocaleState(savedLocale);
    const savedTheme = window.localStorage.getItem('taap.theme') as Theme | null;
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const next = savedTheme ?? (prefersDark ? 'taap-dark' : 'taap');
    setTheme(next);
    document.documentElement.setAttribute('data-theme', next);
  }, []);

  const setLocale = useCallback((l: Locale) => {
    setLocaleState(l);
    window.localStorage.setItem('taap.locale', l);
    document.documentElement.lang = l;
  }, []);

  const toggleTheme = useCallback(() => {
    setTheme((prev) => {
      const next: Theme = prev === 'taap' ? 'taap-dark' : 'taap';
      document.documentElement.setAttribute('data-theme', next);
      window.localStorage.setItem('taap.theme', next);
      return next;
    });
  }, []);

  const say = useCallback((msg: string) => {
    setToast(msg);
    window.setTimeout(() => setToast((cur) => (cur === msg ? null : cur)), 2700);
  }, []);

  const signIn = useCallback((s: Session) => {
    saveSession(s); setSession(s); setBlockId(s.blockId);
  }, []);

  const signOut = useCallback(() => { clearSession(); setSession(null); }, []);

  const block = useMemo(() => blockById(blockId) ?? ALL_BLOCKS[0], [blockId]);
  const district = useMemo(
    () => districtById(block.districtId) ?? DISTRICTS[0],
    [block.districtId],
  );
  const forecast = useMemo(() => forecastFor(block.id, day), [block.id, day]);
  const band = forecast.bands[hour - 6] ?? 1;
  const guidance = BANDS[band];

  const shelters = useMemo(() => sheltersFor(block.id), [block.id, tick]);
  const queue = useMemo(
    () => (session?.role === 'officer' ? queueFor(session.districtId) : queueFor(district.id)),
    [session, district.id, tick],
  );

  const value: Store = {
    locale, setLocale, t: DICT[locale],
    theme, toggleTheme,
    session, signIn, signOut,
    day, setDay, hour, setHour, days: DAYS,
    block, setBlock: setBlockId, district, districts: DISTRICTS,
    forecast, band, guidance,
    mapMode, setMapMode,
    shelters,
    setShelterOpen: (id, open) => { toggleShelter(id, open); setTick((n) => n + 1); },
    queue,
    approve: (ids) => { markApproved(ids); setTick((n) => n + 1); },
    toast, say,
  };

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

/**
 * Heat-stress risk model — pure functions, no I/O, no framework.
 *
 * In production these values arrive precomputed from the downscaling pipeline
 * (FRD M2/M3). This module stays because it is (a) the reference implementation
 * of the grading rules, (b) unit-testable, and (c) what lets the app keep
 * working with no signal — which is exactly where the users are.
 *
 * Traceability: FR-3.1, FR-3.3, FR-3.4, FR-3.5, FR-3.9, DP-2, DP-3.
 */

export type Band = 1 | 2 | 3 | 4 | 5;

/** Normalised diurnal shape, 06:00 → 23:00, peaking mid-afternoon. */
export const SHAPE = [
  0.1, 0.22, 0.38, 0.55, 0.72, 0.87, 0.96, 1, 0.97, 0.88, 0.74, 0.58, 0.44, 0.33,
  0.25, 0.19, 0.14, 0.1,
] as const;

export const HOUR_START = 6;
export const HOURS = SHAPE.length;

/**
 * Apparent temperature (Steadman, as used by the Australian BoM).
 * Humidity is what turns a survivable 42° into a dangerous one, so risk is
 * never graded on dry-bulb temperature alone.
 */
export function feelsLike(tempC: number, relHumidityPct: number): number {
  const vapourPressure =
    (relHumidityPct / 100) * 6.105 * Math.exp((17.27 * tempC) / (237.7 + tempC));
  return tempC + 0.33 * vapourPressure - 4.0;
}

/* ── DP-3 · anomaly-relative alerting ─────────────────────────────────────
 * Risk is not absolute heat. A body adapted to 44° normals copes with 47°;
 * a body adapted to 32° normals does not cope with 44°. Grading on absolute
 * thresholds would alert the wrong districts and, during a sustained hot
 * spell, alert every district every day until nobody listens (RSK-8).
 * ─────────────────────────────────────────────────────────────────────── */

/** °C of effective risk added per °C of departure above the seasonal normal. */
export const ANOMALY_WEIGHT = 0.6;
/** Departure beyond this adds nothing further. */
export const ANOMALY_CAP = 11;
/** Maximum °C of credit a fully acclimatised workforce earns. */
export const ACCLIMATISATION_CREDIT = 3.0;

/**
 * How adapted the local workforce is, 0..1, proxied from the seasonal normal.
 * A production system should derive this from the preceding 7–14 days of
 * actual exposure rather than from climatology (see IMPLEMENTATION_PLAN.md).
 */
export function acclimatisation(seasonalNormalMaxC: number): number {
  return Math.max(0, Math.min(1, (seasonalNormalMaxC - 33) / 11));
}

export function riskScore(
  feels: number,
  normalFeels: number,
  acclim: number,
): number {
  const departure = feels - normalFeels;
  const boost = Math.min(Math.max(departure, 0), ANOMALY_CAP) * ANOMALY_WEIGHT;
  return feels + boost - acclim * ACCLIMATISATION_CREDIT;
}

/** Band from the anomaly-aware risk score. Every band shown in the app uses this. */
export function bandFromRisk(risk: number): Band {
  if (risk < 47) return 1;
  if (risk < 49.5) return 2;
  if (risk < 52) return 3;
  if (risk < 54) return 4;
  return 5;
}

/** Band from raw apparent temperature — only for the map's "Heat only" compare mode. */
export function bandFromHeat(feels: number): Band {
  if (feels < 42) return 1;
  if (feels < 46) return 2;
  if (feels < 49.5) return 3;
  if (feels < 52.5) return 4;
  return 5;
}

export interface AreaClimate {
  /** Forecast maximum for the day, °C. */
  tmax: number;
  /** Forecast minimum for the day, °C. */
  tmin: number;
  /** Relative humidity, %. */
  humidity: number;
  /** 20-year seasonal normal maximum for this date, °C (ERA5-Land climatology). */
  normalMax: number;
  /** True when the source feed has aged past threshold — see DP-2. */
  stale?: boolean;
}

export interface DayForecast {
  temps: number[];
  feels: number[];
  normalFeels: number[];
  anomaly: number[];
  risk: number[];
  bands: Band[];
  acclim: number;
  peakIndex: number;
  peakTemp: number;
  peakFeels: number;
  maxBand: Band;
  /** Contiguous hours at band 3 or above, as "HH:00 – HH:00". */
  window: string | null;
  windowStart: number | null;
  windowEnd: number | null;
}

const pad = (n: number) => String(n).padStart(2, '0');

/**
 * Grade one area for one day.
 *
 * DP-2 (fail to caution): a stale feed raises every band by one. It is never
 * lowered on degraded data — absent or aged input must never produce a calmer
 * output than good input would.
 */
export function gradeDay(climate: AreaClimate, offsetC = 0): DayForecast {
  const mx = climate.tmax + offsetC;
  const mn = climate.tmin + offsetC * 0.5;
  const normMin = climate.normalMax - 13;

  const temps = SHAPE.map((s) => mn + (mx - mn) * s);
  const feels = temps.map((t) => feelsLike(t, climate.humidity));
  const normalFeels = SHAPE.map((s) =>
    feelsLike(normMin + (climate.normalMax - normMin) * s, climate.humidity),
  );
  const anomaly = feels.map((f, i) => f - normalFeels[i]);
  const acclim = acclimatisation(climate.normalMax);
  const risk = feels.map((f, i) => riskScore(f, normalFeels[i], acclim));

  let bands = risk.map(bandFromRisk);
  if (climate.stale) {
    bands = bands.map((b) => Math.min(5, b + 1) as Band);
  }

  const peakIndex = feels.indexOf(Math.max(...feels));
  const hot = bands.reduce<number[]>((acc, b, i) => (b >= 3 ? [...acc, i] : acc), []);
  const windowStart = hot.length ? hot[0] + HOUR_START : null;
  const windowEnd = hot.length ? hot[hot.length - 1] + HOUR_START + 1 : null;

  return {
    temps,
    feels,
    normalFeels,
    anomaly,
    risk,
    bands,
    acclim,
    peakIndex,
    peakTemp: Math.round(temps[peakIndex]),
    peakFeels: Math.round(feels[peakIndex]),
    maxBand: Math.max(...bands) as Band,
    window:
      windowStart !== null && windowEnd !== null
        ? `${pad(windowStart)}:00 – ${pad(windowEnd)}:00`
        : null,
    windowStart,
    windowEnd,
  };
}

import type { Band } from './model';

/**
 * Work-rest and hydration guidance, per band AND per work-intensity class.
 *
 * FR-3.2 requires distinct guidance per intensity, and it matters: at the same
 * heat, a body producing ~415 W hauling headloads sheds far less of it than one
 * producing ~180 W checking a register. ISO 7243 sets its limits against
 * metabolic rate for exactly this reason, so a single work-rest ratio for
 * "workers" is either unsafe for the heaviest work or needlessly costly for
 * the lightest.
 *
 * The `moderate` column is the default and matches the ratios shown before
 * intensity classes existed. `light` and `heavy` fan out around it.
 *
 * All values are placeholders pending occupational-health review against
 * ISO 7243 (FRD open item OI-7). They must not be published as clinical
 * guidance until that review is complete.
 *
 * Traceability: FR-3.2, FR-3.6, FR-3.7.
 */

export type Intensity = 'light' | 'moderate' | 'heavy';

export const INTENSITIES: Intensity[] = ['light', 'moderate', 'heavy'];

export interface IntensityGuidance {
  /** Minutes of work per cycle. 0 with `stop` false means continuous work. */
  workMin: number;
  restMin: number;
  waterMl: number;
  waterEveryMin: number;
  /** Outdoor work should cease entirely. */
  stop?: boolean;
}

export interface BandGuidance {
  band: Band;
  en: string;
  hi: string;
  /** Oral rehydration salts required at this band, regardless of intensity. */
  ors: boolean;
  adviceEn: string;
  adviceHi: string;
  waterEn: string;
  waterHi: string;
  rulesEn: string[];
  rulesHi: string[];
  intensity: Record<Intensity, IntensityGuidance>;
}

export const INTENSITY_LABELS: Record<Intensity, { en: string; hi: string; exampleEn: string; exampleHi: string }> = {
  light: {
    en: 'Light', hi: 'हल्का',
    exampleEn: 'Supervision, guarding, site register, light assembly',
    exampleHi: 'निगरानी, चौकीदारी, रजिस्टर, हल्की जोड़ाई',
  },
  moderate: {
    en: 'Moderate', hi: 'मध्यम',
    exampleEn: 'Masonry, plastering, painting, carrying light loads',
    exampleHi: 'चिनाई, प्लास्टर, पुताई, हल्का बोझ उठाना',
  },
  heavy: {
    en: 'Heavy', hi: 'भारी',
    exampleEn: 'Headload carrying, digging, concrete, rebar, demolition',
    exampleHi: 'सिर पर बोझ, खुदाई, कंक्रीट, सरिया, तोड़-फोड़',
  },
};

export const BANDS: Record<Band, BandGuidance> = {
  1: {
    band: 1, en: 'Low', hi: 'कम', ors: false,
    adviceEn: 'No cycle needed. Keep drinking water through the shift.',
    adviceHi: 'चक्र की ज़रूरत नहीं। पूरी पाली में पानी पीते रहें।',
    waterEn: 'Plain water is enough today.',
    waterHi: 'आज सादा पानी पर्याप्त है।',
    rulesEn: [
      'Keep drinking water even without thirst',
      'Cotton clothing, head covered outdoors',
      'A shaded rest point within 100 m of the work face',
    ],
    rulesHi: [
      'बिना प्यास भी पानी पीते रहें',
      'सूती कपड़े, सिर ढका हुआ',
      'काम की जगह से 100 मीटर में छायादार जगह',
    ],
    intensity: {
      light: { workMin: 0, restMin: 0, waterMl: 250, waterEveryMin: 60 },
      moderate: { workMin: 0, restMin: 0, waterMl: 250, waterEveryMin: 60 },
      heavy: { workMin: 0, restMin: 0, waterMl: 350, waterEveryMin: 60 },
    },
  },
  2: {
    band: 2, en: 'Moderate', hi: 'मध्यम', ors: false,
    adviceEn: 'Take the break in shade, sitting. Watch new workers closely.',
    adviceHi: 'ब्रेक छाया में, बैठकर लें। नए मज़दूरों पर नज़र रखें।',
    waterEn: 'One full bottle every hour, plain water.',
    waterHi: 'हर घंटे एक पूरी बोतल, सादा पानी।',
    rulesEn: [
      'Rest sitting in shade, not standing in sun',
      'New and returning workers on half load for 4 days',
      'Loose cotton, full sleeves, head covered',
      'Supervisor checks every worker once an hour',
    ],
    rulesHi: [
      'छाया में बैठकर आराम, धूप में खड़े होकर नहीं',
      'नए मज़दूर 4 दिन आधे भार पर',
      'ढीले सूती कपड़े, पूरी बाँह, सिर ढका',
      'सुपरवाइज़र हर घंटे हर मज़दूर को देखे',
    ],
    intensity: {
      light: { workMin: 0, restMin: 0, waterMl: 400, waterEveryMin: 60 },
      moderate: { workMin: 45, restMin: 15, waterMl: 500, waterEveryMin: 60 },
      heavy: { workMin: 40, restMin: 20, waterMl: 600, waterEveryMin: 60 },
    },
  },
  3: {
    band: 3, en: 'High', hi: 'अधिक', ors: true,
    adviceEn: 'Move heavy lifting outside the danger window. Rest in shade, not sun.',
    adviceHi: 'भारी काम खतरे के समय से बाहर करें। छाया में आराम करें।',
    waterEn: 'ORS in every second bottle. Do not wait for thirst.',
    waterHi: 'हर दूसरी बोतल में ORS। प्यास का इंतज़ार न करें।',
    rulesEn: [
      'Heavy lifting only before the window opens',
      'Rest in shade with airflow — a tarpaulin alone is not enough',
      'Wet cloth on neck and wrists at every break',
      'Nobody works alone; pair every worker',
      'Watch the newest worker on site closest',
    ],
    rulesHi: [
      'भारी काम केवल खतरे के समय से पहले',
      'हवादार छाया में आराम — केवल तिरपाल काफ़ी नहीं',
      'हर ब्रेक पर गर्दन और कलाई पर गीला कपड़ा',
      'कोई अकेला काम न करे; जोड़ी बनाएँ',
      'सबसे नए मज़दूर पर सबसे ज़्यादा ध्यान',
    ],
    intensity: {
      light: { workMin: 50, restMin: 10, waterMl: 500, waterEveryMin: 45 },
      moderate: { workMin: 40, restMin: 15, waterMl: 500, waterEveryMin: 30 },
      heavy: { workMin: 30, restMin: 30, waterMl: 500, waterEveryMin: 20 },
    },
  },
  4: {
    band: 4, en: 'Very high', hi: 'बहुत अधिक', ors: true,
    adviceEn: 'Move the task itself into shade, or reschedule it.',
    adviceHi: 'काम को ही छाया में ले जाएँ, या समय बदलें।',
    waterEn: 'ORS every time. Rest at a cooling station if one is near.',
    waterHi: 'हर बार ORS। पास हो तो शीतल केंद्र में आराम करें।',
    rulesEn: [
      'Stop all heavy lifting inside the danger window',
      'Relocate the task to shade or reschedule it',
      'Rest at a cooling station if one is within 2 km',
      'Two-person rule — no worker out of sight',
      'Anyone unwell stops for the day, no exceptions',
    ],
    rulesHi: [
      'खतरे के समय में सारा भारी काम बंद',
      'काम को छाया में ले जाएँ या समय बदलें',
      '2 किमी में शीतल केंद्र हो तो वहाँ आराम',
      'दो का नियम — कोई नज़र से ओझल न हो',
      'तबीयत बिगड़े तो पूरे दिन के लिए काम बंद',
    ],
    intensity: {
      light: { workMin: 40, restMin: 20, waterMl: 500, waterEveryMin: 30 },
      moderate: { workMin: 30, restMin: 30, waterMl: 500, waterEveryMin: 20 },
      heavy: { workMin: 20, restMin: 40, waterMl: 500, waterEveryMin: 15 },
    },
  },
  5: {
    band: 5, en: 'Extreme', hi: 'अत्यधिक', ors: true,
    adviceEn: 'Essential work only, in shade, short stints. Move the crew to a cooling station.',
    adviceHi: 'केवल ज़रूरी काम, छाया में, थोड़ी-थोड़ी देर। टीम को शीतल केंद्र भेजें।',
    waterEn: 'ORS in every bottle, before and after each stint.',
    waterHi: 'हर बोतल में ORS, हर दौर से पहले और बाद में।',
    rulesEn: [
      'Move the whole crew to a cooling station',
      'Only emergency or essential work continues',
      'Always in shade, never alone',
      'Supervisor stays with the crew — no remote sign-off',
      'Wages must not depend on continuing work today',
    ],
    rulesHi: [
      'पूरी टीम को शीतल केंद्र भेजें',
      'केवल आपातकालीन या ज़रूरी काम',
      'हमेशा छाया में, कभी अकेले नहीं',
      'सुपरवाइज़र टीम के साथ रहे',
      'आज काम जारी रखने पर मज़दूरी निर्भर न हो',
    ],
    intensity: {
      light: { workMin: 25, restMin: 35, waterMl: 500, waterEveryMin: 20 },
      moderate: { workMin: 15, restMin: 45, waterMl: 500, waterEveryMin: 20 },
      heavy: { workMin: 0, restMin: 60, waterMl: 500, waterEveryMin: 15, stop: true },
    },
  },
};

export const guidanceFor = (band: Band, intensity: Intensity): IntensityGuidance =>
  BANDS[band].intensity[intensity];

/** CSS custom property for a band fill. Never inline a band hex anywhere else. */
export const bandFill = (b: Band) => `var(--band-${b})`;
export const bandInk = (b: Band) => `var(--band-${b}-ink)`;

export function cycleLabel(g: IntensityGuidance, locale: 'en' | 'hi'): string {
  if (g.stop) return locale === 'hi' ? 'बाहरी काम बंद करें' : 'Stop outdoor work';
  if (!g.workMin) return locale === 'hi' ? 'लगातार काम करें' : 'Work continuously';
  return locale === 'hi'
    ? `${g.workMin} मिनट काम · ${g.restMin} मिनट आराम`
    : `${g.workMin} min work · ${g.restMin} min rest`;
}

/** Litres a worker should drink across an 8-hour shift. */
export const shiftLitres = (g: IntensityGuidance) =>
  ((g.waterMl * (60 / g.waterEveryMin) * 8) / 1000).toFixed(1);

export const cyclesPerHour = (g: IntensityGuidance) =>
  g.workMin ? (60 / (g.workMin + g.restMin)).toFixed(1) : null;

/** Minutes of work permitted per hour — the ISO 7243 way of stating the same limit. */
export const workMinutesPerHour = (g: IntensityGuidance) => {
  if (g.stop) return 0;
  if (!g.workMin) return 60;
  return Math.round((g.workMin / (g.workMin + g.restMin)) * 60);
};

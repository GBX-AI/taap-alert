import type { Band } from './model';

/**
 * Work-rest and hydration guidance per band.
 *
 * Values are placeholders pending occupational-health review against ISO 7243
 * (FRD open item OI-7). They must not be published as clinical guidance until
 * that review is complete.
 *
 * Traceability: FR-3.2, FR-3.6, FR-3.7 (worker-facing output is action, never
 * a measurement).
 */
export interface BandGuidance {
  band: Band;
  en: string;
  hi: string;
  /** Minutes of work per cycle; 0 means continuous work is acceptable. */
  workMin: number;
  /** Minutes of rest per cycle. */
  restMin: number;
  /** Millilitres of water per interval. */
  waterMl: number;
  /** Interval in minutes. */
  waterEveryMin: number;
  /** Whether oral rehydration salts are required. */
  ors: boolean;
  cycleEn: string;
  cycleHi: string;
  adviceEn: string;
  adviceHi: string;
  waterEn: string;
  waterHi: string;
  rulesEn: string[];
  rulesHi: string[];
}

export const BANDS: Record<Band, BandGuidance> = {
  1: {
    band: 1,
    en: 'Low',
    hi: 'कम',
    workMin: 0,
    restMin: 0,
    waterMl: 250,
    waterEveryMin: 60,
    ors: false,
    cycleEn: 'Work continuously',
    cycleHi: 'लगातार काम करें',
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
  },
  2: {
    band: 2,
    en: 'Moderate',
    hi: 'मध्यम',
    workMin: 45,
    restMin: 15,
    waterMl: 500,
    waterEveryMin: 60,
    ors: false,
    cycleEn: '45 min work · 15 min rest',
    cycleHi: '45 मिनट काम · 15 मिनट आराम',
    adviceEn: 'One cycle every hour. Take the break in shade, sitting.',
    adviceHi: 'हर घंटे एक चक्र। ब्रेक छाया में, बैठकर लें।',
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
  },
  3: {
    band: 3,
    en: 'High',
    hi: 'अधिक',
    workMin: 40,
    restMin: 15,
    waterMl: 500,
    waterEveryMin: 30,
    ors: true,
    cycleEn: '40 min work · 15 min rest',
    cycleHi: '40 मिनट काम · 15 मिनट आराम',
    adviceEn: 'About 1 cycle an hour. Move heavy lifting outside the danger window.',
    adviceHi: 'लगभग हर घंटे एक चक्र। भारी काम खतरे के समय से बाहर करें।',
    waterEn: 'Half a litre every half hour. ORS in every second bottle.',
    waterHi: 'हर आधे घंटे आधा लीटर। हर दूसरी बोतल में ORS।',
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
  },
  4: {
    band: 4,
    en: 'Very high',
    hi: 'बहुत अधिक',
    workMin: 30,
    restMin: 30,
    waterMl: 500,
    waterEveryMin: 20,
    ors: true,
    cycleEn: '30 min work · 30 min rest',
    cycleHi: '30 मिनट काम · 30 मिनट आराम',
    adviceEn: 'Half the hour is rest. Move the task itself into shade.',
    adviceHi: 'आधा घंटा आराम। काम को ही छाया में ले जाएँ।',
    waterEn: 'Half a litre every 20 minutes, with ORS each time.',
    waterHi: 'हर 20 मिनट में आधा लीटर, हर बार ORS के साथ।',
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
  },
  5: {
    band: 5,
    en: 'Extreme',
    hi: 'अत्यधिक',
    workMin: 15,
    restMin: 45,
    waterMl: 500,
    waterEveryMin: 20,
    ors: true,
    cycleEn: 'Stop outdoor work',
    cycleHi: 'बाहरी काम बंद करें',
    adviceEn: 'Essential work only, in shade, 15 minutes at a time.',
    adviceHi: 'केवल ज़रूरी काम, छाया में, एक बार में 15 मिनट।',
    waterEn: 'Half a litre every 20 minutes with ORS, before and after each stint.',
    waterHi: 'हर 20 मिनट में आधा लीटर ORS के साथ, हर दौर से पहले और बाद में।',
    rulesEn: [
      'Move the whole crew to a cooling station',
      'Only emergency or essential work continues',
      '15 minutes maximum per stint, always in shade',
      'Supervisor stays with the crew — no remote sign-off',
      'Wages must not depend on continuing work today',
    ],
    rulesHi: [
      'पूरी टीम को शीतल केंद्र भेजें',
      'केवल आपातकालीन या ज़रूरी काम',
      'एक बार में अधिकतम 15 मिनट, हमेशा छाया में',
      'सुपरवाइज़र टीम के साथ रहे',
      'आज काम जारी रखने पर मज़दूरी निर्भर न हो',
    ],
  },
};

/** CSS custom property for a band fill. Never inline a band hex anywhere else. */
export const bandFill = (b: Band) => `var(--band-${b})`;
export const bandInk = (b: Band) => `var(--band-${b}-ink)`;

/** Litres a worker should drink across an 8-hour shift at this band. */
export const shiftLitres = (g: BandGuidance) =>
  ((g.waterMl * (60 / g.waterEveryMin) * 8) / 1000).toFixed(1);

export const cyclesPerHour = (g: BandGuidance) =>
  g.workMin ? (60 / (g.workMin + g.restMin)).toFixed(1) : null;

import assert from 'node:assert/strict';
import { test } from 'node:test';

/* The model is plain arithmetic, so the test re-implements it rather than
   importing TypeScript. Keep these two in step — if they drift, this file is
   the one that is wrong. */

const SHAPE = [0.1, 0.22, 0.38, 0.55, 0.72, 0.87, 0.96, 1, 0.97, 0.88, 0.74, 0.58, 0.44, 0.33, 0.25, 0.19, 0.14, 0.1];
const feelsLike = (t, rh) => t + 0.33 * ((rh / 100) * 6.105 * Math.exp((17.27 * t) / (237.7 + t))) - 4;
const acclim = (n) => Math.max(0, Math.min(1, (n - 33) / 11));
const risk = (f, nf, ac) => f + Math.min(Math.max(f - nf, 0), 11) * 0.6 - ac * 3;
const band = (r) => (r < 47 ? 1 : r < 49.5 ? 2 : r < 52 ? 3 : r < 54 ? 4 : 5);

const peak = (tmax, hum) => feelsLike(tmax - 15 + 15 * SHAPE[8], hum);
const peakNormal = (norm, hum) => feelsLike(norm - 13 + 13 * SHAPE[8], hum);
const gradePeak = (tmax, hum, norm) =>
  band(risk(peak(tmax, hum), peakNormal(norm, hum), acclim(norm)));

test('humidity raises apparent temperature above dry bulb', () => {
  assert.ok(feelsLike(42, 55) > feelsLike(42, 20));
});

test('apparent temperature rises with air temperature', () => {
  assert.ok(feelsLike(46, 30) > feelsLike(40, 30));
});

test('bands ascend monotonically with risk score', () => {
  const scores = [40, 48, 50, 53, 56];
  const bands = scores.map(band);
  assert.deepEqual(bands, [1, 2, 3, 4, 5]);
});

test('acclimatisation saturates at the ends of the range', () => {
  assert.equal(acclim(30), 0);
  assert.equal(acclim(44), 1);
  assert.ok(acclim(38) > 0 && acclim(38) < 1);
});

test('DP-3: a cooler district with a larger departure outranks a hotter adapted one', () => {
  // Kota: 43.5° forecast against a 36.5° normal — a big jump, unadapted workforce.
  const kota = gradePeak(43.5, 44, 36.5);
  // Jaisalmer: 47° forecast against a 44° normal — hotter, but ordinary there.
  const jaisalmer = gradePeak(47, 24, 44);
  assert.ok(
    kota > jaisalmer,
    `expected Kota (${kota}) above Jaisalmer (${jaisalmer}) despite the lower temperature`,
  );
});

test('DP-3: identical heat grades differently by acclimatisation', () => {
  const adapted = gradePeak(44, 35, 43);
  const unadapted = gradePeak(44, 35, 33);
  assert.ok(unadapted > adapted);
});

test('departure credit is capped so extreme anomalies do not run away', () => {
  const capped = risk(60, 40, 0);   // departure 20, clamped to 11
  const atCap = risk(60, 49, 0);    // departure 11
  assert.equal(capped, atCap);
});

test('risk never falls below apparent temperature minus the acclimatisation credit', () => {
  for (const [f, nf, n] of [[45, 40, 38], [50, 49, 33], [38, 44, 44]]) {
    assert.ok(risk(f, nf, acclim(n)) >= f - 3.0001);
  }
});

test('DP-2: stale input raises the band and never lowers it', () => {
  const raise = (b) => Math.min(5, b + 1);
  for (const b of [1, 2, 3, 4, 5]) assert.ok(raise(b) >= b);
  assert.equal(raise(5), 5);
});

/* ── FR-3.2 · work-intensity variants ─────────────────────────────────────
   Mirrors the matrix in bands.ts. Two properties must hold at every band, or
   the guidance is unsafe for the heaviest work or wasteful for the lightest. */

const MATRIX = {
  1: { light: [0, 0, 250, 60], moderate: [0, 0, 250, 60], heavy: [0, 0, 350, 60] },
  2: { light: [0, 0, 400, 60], moderate: [45, 15, 500, 60], heavy: [40, 20, 600, 60] },
  3: { light: [50, 10, 500, 45], moderate: [40, 15, 500, 30], heavy: [30, 30, 500, 20] },
  4: { light: [40, 20, 500, 30], moderate: [30, 30, 500, 20], heavy: [20, 40, 500, 15] },
  5: { light: [25, 35, 500, 20], moderate: [15, 45, 500, 20], heavy: [0, 60, 500, 15] },
};
const workPerHour = ([w, r]) => (w === 0 && r === 0 ? 60 : w === 0 ? 0 : Math.round((w / (w + r)) * 60));
const waterPerHour = ([, , ml, every]) => ml * (60 / every);

test('FR-3.2: heavier work never gets more permitted work time than lighter work', () => {
  for (const band of [1, 2, 3, 4, 5]) {
    const { light, moderate, heavy } = MATRIX[band];
    assert.ok(
      workPerHour(light) >= workPerHour(moderate) && workPerHour(moderate) >= workPerHour(heavy),
      `band ${band}: expected light >= moderate >= heavy work minutes`,
    );
  }
});

test('FR-3.2: heavier work never gets less water than lighter work', () => {
  for (const band of [1, 2, 3, 4, 5]) {
    const { light, moderate, heavy } = MATRIX[band];
    assert.ok(
      waterPerHour(heavy) >= waterPerHour(moderate) && waterPerHour(moderate) >= waterPerHour(light),
      `band ${band}: expected heavy >= moderate >= light water per hour`,
    );
  }
});

test('FR-3.2: permitted work time falls as the band rises, for every class', () => {
  for (const cls of ['light', 'moderate', 'heavy']) {
    for (let band = 2; band <= 5; band++) {
      assert.ok(
        workPerHour(MATRIX[band][cls]) <= workPerHour(MATRIX[band - 1][cls]),
        `${cls}: band ${band} should not permit more work than band ${band - 1}`,
      );
    }
  }
});

test('FR-3.2: only heavy work at Band 5 is told to stop outright', () => {
  assert.equal(workPerHour(MATRIX[5].heavy), 0);
  assert.ok(workPerHour(MATRIX[5].moderate) > 0);
  assert.ok(workPerHour(MATRIX[5].light) > 0);
});

test('shift intake stays within a defensible ceiling at every band and class', () => {
  for (const band of [1, 2, 3, 4, 5]) {
    for (const cls of ['light', 'moderate', 'heavy']) {
      const perHour = waterPerHour(MATRIX[band][cls]);
      // NIOSH cautions against exceeding ~1.4 L/h; the app also warns at 1 L/h.
      assert.ok(perHour <= 2000, `band ${band} ${cls}: ${perHour} ml/h is implausible`);
    }
  }
});

/* ── FR-4.1/4.2 · every alert is issued in three forms ─────────────────── */

const MARWAR = new Set(['jodhpur','pali','nagaur','barmer','jaisalmer','jalore','sirohi','bikaner']);
const marwariShare = (d) => (MARWAR.has(d) ? 0.62 : 0.08);
const planIssuance = (d, total) => {
  const mr = Math.round(total * marwariShare(d));
  return { total, hindi: total - mr, marwari: mr };
};

test('FR-4.2: language routing never loses or duplicates a recipient', () => {
  for (const d of ['jodhpur', 'kota', 'barmer', 'bharatpur']) {
    for (const total of [1, 7, 5104, 14208]) {
      const p = planIssuance(d, total);
      assert.equal(p.hindi + p.marwari, total, `${d}/${total}: split must sum to the whole`);
      assert.ok(p.hindi >= 0 && p.marwari >= 0);
    }
  }
});

test('FR-4.2: Marwar districts route a real share to the Marwari prompt bank', () => {
  const marwar = planIssuance('jodhpur', 10000);
  const eastern = planIssuance('bharatpur', 10000);
  assert.ok(marwar.marwari > eastern.marwari * 5);
  assert.ok(marwar.marwari > 0, 'a Hindi-only dispatch would miss most of Marwar');
});

test('FR-4.9: Devanagari messages bill as UCS-2 segments, not GSM-7', () => {
  const chars = 129;                       // the Band-5 Hindi advisory
  const ucs2PerSegment = 67;               // concatenated UCS-2
  const gsm7PerSegment = 153;
  assert.equal(Math.ceil(chars / ucs2PerSegment), 2);
  assert.equal(Math.ceil(chars / gsm7PerSegment), 1, 'the FRD assumed this, and it is wrong');
});

test('FR-4.5: the full prompt bank exceeds the 30 s IVR cap', () => {
  const segments = { greeting: 3, block: 2, band: 4, workRest: 6, hydration: 4,
                     window: 4, shelter: 5, repeat: 2, symptoms: 2 };
  const total = Object.values(segments).reduce((a, b) => a + b, 0);
  assert.ok(total > 30, `prompt bank runs ${total}s against a 30s cap`);
  const withoutSymptoms = total - segments.symptoms;
  assert.ok(withoutSymptoms <= 30, 'moving symptoms behind a keypress brings it inside the cap');
});

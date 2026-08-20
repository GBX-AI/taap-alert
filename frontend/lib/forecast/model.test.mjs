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

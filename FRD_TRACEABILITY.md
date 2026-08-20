# FRD traceability

What this prototype covers against *Functional Requirements Document — Heat-Stress
Early Warning System for Outdoor Workers, v1.0*, and what it does not.

Written to be read by an evaluator. Where something is not built, it says so.

## Key features

| Ref | Requirement | Status |
|---|---|---|
| **KF-1** | Hyperlocal (block/ward) heat-index forecasting | **Partial** — 33 districts × 136 blocks and wards graded hourly across 4 days, but from a synthetic diurnal model, not a downscaled NWP |
| **KF-2** | SMS/voice alerts in regional language with practical guidance | **Partial** — Hindi SMS and Marwari IVR script rendered with segment and duration checks; no dispatch |
| **KF-3** | Administrative dashboard for shelter siting and timing advisories | **Partial** — approval queue, advisory detail, dispatch gesture, shelter open/close recording; no optimiser |
| **KF-4** | Integration with labour department databases | **Demonstrated in miniature** — phone number resolves to a seeded BOCW/MGNREGA record and targets that worker's own block |

## Design principles

| Ref | Principle | Where |
|---|---|---|
| **DP-1** | Escalation moves upward | Band 5 guidance states wages must not depend on continuing work; approval queue is officer-only |
| **DP-2** | Fail to caution, never to green | Stale feed raises the band and marks it with a hatch; never lowered on degraded input. Unit-tested |
| **DP-3** | Anomaly-relative alerting | **The core of the build.** Bands driven by departure from seasonal normal minus acclimatisation credit. Visible via the Risk/Heat map toggle and the "why this band" card. Unit-tested |
| **DP-4** | Guidance, not measurement | Worker-facing output is a dial, bottles, an interval and a place. Numbers caption the pictogram |
| **DP-5** | Consume, do not reinvent | Grading isolated in one pure module so a validated index can replace it wholesale |
| **DP-6** | No hardware dependency | Runs entirely on device |

## Modules

| Module | Status | Notes |
|---|---|---|
| **M1** Ingestion & store | **Not built** | No feed health surface. FR-1.9 unmet |
| **M2** Downscaling & forecast | **Not built** | Synthetic model stands in. No validation surface: MAE/RMSE by lead time, leave-one-station-out, leave-one-district-out, band-assignment accuracy (FR-2.11–2.16) all absent |
| **M3** Risk grading & advisory | **Substantially covered** | FR-3.1 apparent temperature ✓ · **FR-3.2 work-intensity classes ✓** — light/moderate/heavy each carry their own work-rest ratio and hydration interval, switchable on Now, all three issued per advisory · FR-3.3 five bands ✓ · FR-3.5 anomaly-relative ✓ · FR-3.6 structured advisory ✓ · FR-3.7 action not measurement ✓ · FR-3.9/3.10 stale and absent data ✓ · **FR-3.4 uncertainty-aware band assignment ✗** — confidence is displayed but does not shift the band |
| **M4** Alert delivery | **Preview only** | SMS and IVR content rendered with the 2-segment UCS-2 and 0:32-over-0:30 defects surfaced. No aggregator, no retry queue, no per-recipient logging (FR-4.11–4.13), no opt-out (FR-4.12) |
| **M5** Registry & labour DB | **Miniature** | Seeded registry lookup by phone (FR-5.6 targeting). No import, dedupe, consent capture or DPDP rights (FR-5.2–5.9) |
| **M6** Administrative dashboard | **Partial** | FR-6.1 risk surface ✓ · FR-6.2 drill-down ✓ · FR-6.5 review/approve ✓ · FR-6.6 no dispatch without approval ✓ · FR-6.10 responsive ✓ · FR-6.11 English + Hindi ✓ · **FR-6.3/6.4 shelter optimiser ✗** · **FR-6.7 feed health ✗** · **FR-6.8 delivery statistics ✗** · **FR-6.9 CSV/GeoJSON export ✗** |
| **M7** Audit & reporting | **Covered** | FR-7.1 immutable per-advisory log with block, date, band, guidance content, approving user, dispatch time, recipient count **and the data vintage it was built on** ✓ · FR-7.2 CSV and JSON export for a district ✓ · provenance chain from feed issue → model run → band assignment → approval → dispatch ✓ · SHA-256 over issued content ✓ · **FR-7.3 statutory compliance report ✗** · export is not cryptographically signed |
| **M8** Admin console & access control | **Partial** | Roles exist and gate the approval queue (FR-7.5). No user management, no configuration screens, no Rajasthan SSO (FR-7.7) |

## Acceptance criteria

| Ref | Criterion | Status |
|---|---|---|
| AC-1 | Block/ward forecasts across ≥72 h with published validation | ✗ — forecasts yes, validation no |
| AC-2 | RMSE reduction vs nearest-district baseline, leave-one-district-out | ✗ |
| AC-3 | IVR in Hindi and Marwari, under 30 s, with repeat | ✗ — script only, and it runs 0:32 |
| AC-4 | SMS in Devanagari with correct band content | ✗ — content only, not delivered |
| AC-5 | Dashboard shows risk surface, shelter plan, advisory through approval | **Partial** — surface and approval yes, shelter plan no |
| AC-6 | Labour DB adapters on schema-conformant synthetic records | ✗ |
| AC-7 | Stale and no-data conditions produce caution, never low-risk | ✓ — implemented and unit-tested |
| AC-8 | Audit trail exportable including data vintage | ✓ — implemented; export not yet signed |

## Defects found in the FRD itself

Surfaced in the advisory console rather than buried in a document:

1. **FR-4.9 is wrong on SMS length.** 160 characters is GSM-7. Devanagari sends
   as UCS-2 at 67 characters per concatenated segment. The Band-5 message is 129
   characters — two segments, with the cost and delivery implications that carries.
2. **FR-4.5 conflicts with FR-4.4.** The full prompt bank spoken in Hindi runs
   about 32 seconds against a 30-second cap. Symptom guidance is the natural
   thing to move behind a keypress.
3. **TRAI/DLT is absent from the FRD entirely.** Every SMS template must be
   DLT-registered with a registered header; transactional classification governs
   DND override. This belongs in §13 as a risk and §15 as an open item.
4. **DPDP consent has a hole.** BOCW and MGNREGA records arrive without consent,
   so FR-5.8 would suppress every recipient on day one. The legal basis for first
   contact, notice, data-principal rights and a grievance officer are unspecified.
5. **Two reported metrics have no mechanism.** "Supervisor advisories
   acknowledged" and "cooling locations recommended vs. opened" (§11.1) — nothing
   in the FRD produces either. The shelter open/close control here is one half.
6. **AC-2 says "statistically significant" with no test, alpha or effect size.**

## Next, in priority order

1. **FR-3.4 uncertainty-aware band assignment** — confidence is computed and
   displayed but does not yet resolve upward into the band, which DP-2 implies
   it should.
2. **FR-6.3/6.4 shelter optimiser** — the one genuinely novel piece of the
   administrative dashboard still missing.
3. **M5 registry import and DPDP consent** — the largest untouched module, and
   the one with the legal exposure.
4. **FR-7.2 signed export** — the audit trail exports, but a signature is what
   makes it evidence rather than a spreadsheet.

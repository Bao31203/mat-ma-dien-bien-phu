# Foundation test report — 2026-10-29

## Summary

Status: DONE_WITH_CONCERNS. No confirmed core defect. `npm test`: 21 passed, 0 failed, 0 skipped; runner duration 1.45 s. Additional read-only Node probes: 44 assertions passed. No production/test code changed.

Scope: current core rules, save validation/storage and geometry against approved phases 01/04. Read README, code standards, phase contracts and all current tests/core modules. Applied `ck:test`; report location follows `ck:project-organization` and controller assignment.

## Findings

| Contract | Evidence | Result |
| --- | --- | --- |
| Discovery does not grant a puzzle card; collection atomically completes its clue beat | `tests/game-rules.test.js:44`; submit with only discoveries rejected at line 64 | Pass |
| Wrong/incomplete/duplicate/unknown puzzle cards do not unlock a room | Him Lam test line 64; campaign/telegram test line 80 | Pass |
| Four-room progression, bounded hints, revisits, checkpoint action shape | Full journey line 19; gates/checkpoint test line 93 | Pass |
| Optional peace memories and reflection remain optional | Zero-peace-clue route at line 114; supplemental route also retains zero peace clues | Pass |
| Malformed/version/future/contradictory saves rejected | Rule test line 131 and storage test line 24 | Pass |
| Audio preferences validate finite range/types; runtime data discarded | Rule test line 131; storage round-trip line 11; supplemental valid-volume endpoints 0/1 | Pass |
| Storage failures do not escape or erase the prior save | `tests/save-store.test.js:35` and line 47 | Pass |
| All map checkpoints and interaction/exit approaches reachable with real body clearance | Six map cases in `tests/world-geometry.test.js:12`; locked gate and unlocked exit checks | Pass |
| Future chapters cannot be entered by action or loaded save at any progression prefix | Supplemental matrix across every prefix and future chapter | Pass |
| Requested safe non-entry checkpoint retained exactly; unsafe known checkpoint falls back to safe entry; unsafe entry rejected | Supplemental checks on all six maps, mutating in-memory copies only; `resolveCheckpoint` at `src/core/world-geometry.js:17` | Pass |

## Coverage gaps and recommendations

1. Persistent geometry suite checks missing-ID fallback, but not known-ID unsafe-position fallback or unsafe-entry rejection. These branches passed supplemental assertions; consider promoting those checks to regression tests.
2. Persistent gating tests sample early skip and ending-save rejection. Supplemental all-prefix action/save matrix passed; consider retaining the matrix for future progression edits.
3. `validateSave` deliberately retains a syntactically valid unknown checkpoint (`tests/game-rules.test.js:144`); `loadSave` is semantic storage validation only. Composition must resolve/fallback before resume. That boundary matches the approved split, but requires later browser/integration evidence.

No coverage percentage collected; this was invariant review, not instrumented coverage. No build/browser run: production integration still in progress and controller explicitly reserved those checks. These are pending acceptance checks, not reported defects: active VN cursor enforcement, actual autosave timing/count, checkpoint dispatch validation, blocked storage notices during play, reset/cancel behavior, saved audio preference without autoplay, modal/blur input/audio cleanup, and full UI journey.

## Unresolved questions

None for this assigned core verification scope.

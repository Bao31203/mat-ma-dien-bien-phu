# Full game code review

Date: 2026-10-29. Scope: production implementation, read-only review. Approved plan and phase acceptance criteria checked against actual files. Prototype QA was not used as production evidence.

## Summary

No evidence-backed blocking findings remain. Two Medium acceptance gaps were identified and corrected by the controller; narrow re-review passed. Core progression, explicit clue collection, save validation and geometry checks passed. Final acceptance still requires the controller/tester's browser matrix and production/offline checks.

## Scope and method

- Read README, project code standards, approved plan and all five phase files before review.
- Applied `ck:scout`, `ck:code-review`, spec-compliance protocol and base/web-app two-pass checklists. No Git repository exists, so reviewed the complete production files rather than inventing a diff.
- Scouted dependents and boundaries first: `main → GameSession → actions/rules/storage/UI/scene/audio`; native dialog replacement/close; held-key reset; asynchronous audio enable/reset; checkpoint callbacks; discovered/collected/completed invariants.
- Reviewed all 26 source files, tests, package/config/index shell. No production source changes made by reviewer. Controller additionally authorized the focused lifecycle test in `tests/audio-controller.test.js`.
- Threat model: local single-player learning game. No accounts, server, database or secrets; authentication, rate limits, encryption and anti-cheat are not applicable.

## Resolved findings

### Medium: unfinished chapter introductions disappear from replay

Evidence: `src/ui/archive-view.js:38` includes a beat only if completed or linked to a discovered clue. `src/app/game-session.js:161` opens the current chapter introduction automatically, but closing it does not mark completion, correctly. Bunker maps in `src/content/world-data.js:42` provide clue/puzzle interactions, with no story interaction to reopen that introduction.

Reproduction: finish museum introduction, enter Him Lam, close its introduction with Esc, open **Lời đã đọc**. The current introduction is absent. A direct harness using the actual `ArchiveView.backlog()` and reducer produced only the completed museum entry. The same condition applies to campaign-map, command-post and peace. Reload/re-enter can recover the intro, but the advertised replay path cannot.

Fix: include the current eligible chapter introduction in backlog even when incomplete, labeled unfinished; do not mark it complete or grant any clue. Verify Esc → backlog → reopen → explicit completion, and replay after reload.

Resolved in re-review: backlog now includes introduction beats for all reached chapters through the current chapter. A real-ArchiveView harness exercised all six chapters while deliberately skipping bunker introductions: every reached intro remained present, every future intro stayed hidden, a previous unfinished Him Lam intro reopened through its callback, and rendering/reopening did not mutate state or grant clues.

### Medium: suspended audio retains the active UI/toggle state

Evidence: `src/audio/audio-controller.js:23` handles context state changes only with `sync()`. `getSnapshot()` at line 80 still exposes `unlocked: true` after a previously running context becomes suspended. `src/app/game-session.js:177` computes its toggle from saved preference plus `unlocked`, and `src/ui/game-interface.js:59` labels it **Tắt âm thanh** using the same stale value. The settings retry button likewise checks only unlock state.

Reproduction: enable sound, then suspend/interruption occurs. A direct real-controller harness with a simulated running → suspended context yields `unlocked:true`, `running:false`, `audible:false`, `notice:null`. The next toggle computes disabled and does not call resume; the player needs another toggle to restore sound. This is a deterministic controller/UI mismatch; occurrence under a particular browser/OS interruption still needs browser validation.

Fix: expose effective playback/resume eligibility separately from remembered gesture permission; use current context state in UI and toggle decisions. On a non-running state, offer explicit click-to-resume feedback without retrying resume automatically. Verify suspend → one explicit enable click → running, plus mute/reset while resume is pending.

Resolved in re-review: context statechange now clears/reestablishes effective unlock, supplies retry notice, stops graph sources and notifies HUD. Composition toggle and UI use `running`. New focused tests verify saved preference cannot instantiate/resume audio, suspension notifies UI and removes active sources, modes/movement cannot auto-resume, one explicit resume restores the same context, mute clears sources/gain, and disabling during pending resume remains silent. Adapter tests verify lifecycle, not audible PCM.

## Verified contracts

- Six chapters and four-room prefix progression; museum introduction gates entry; each exit requests reducer authorization. Peace continues without optional clues, choices or text.
- Him Lam has exactly the approved four clue IDs and four stages. Discovery alone grants no cards; last-line composition guard precedes atomic clue/beat completion. Exact-order, duplicate/missing/unknown-card rejection covered by tests.
- Pure reducer/validation modules do not import Phaser, DOM, storage or Web Audio. Storage getter/parse/get/set/remove failures are caught; loaded settings/IDs/progress are sanitized, with safe checkpoint fallback in composition.
- Scene uses shared rendering/collision geometry; 2400×1440 challenge maps, bounded follow camera and normalized diagonal speed. Reachability tests cover all maps/checkpoints/targets/locked gates.
- Four directional idle/four-frame gait atlases exist. Animation and footsteps use post-collision displacement; modal/focus/blur paths reset held keys, motion and steps. Native close events guard against clearing a freshly reopened dialog.
- HUD render preserves active narrative and puzzle drafts. Content enters DOM through text nodes; private peace text is omitted from save. Assets and runtime imports are local, with no production dependency on the prototype.
- Asynchronous audio requests use sequence counters in composition; reset invalidates pending preference updates. One lazy controller/context exists; volume/mute and dialogue/inactive modes update real gain/source chains.

## Validation

- After audio/backlog fixes, focused `node --test tests/audio-controller.test.js`: 2 passed; fresh `npm test`: 23 passed, 0 failed.
- Reviewer build after backlog/audio lifecycle fixes: exit 0, Vite 8.3.5; application bundle `index-DaZXG46G.js`. Phaser large-chunk warning only (1,194.43 kB minified / 318.49 kB gzip); not a correctness finding or measured performance claim.
- Runtime dependency pins: Phaser 3.90.0, Vite 8.3.5. Production `base: './'`, local bundled assets.
- Type coverage: not measured; JavaScript project. Test coverage percentage: not measured. Lint: no lint script configured, no lint result claimed.
- Reviewer did not operate browser sessions or claim audible PCM, full-route physical movement, resize/zoom, interruption recovery, or offline browser verification. Controller and independent tester own those observations.

## Bounded final follow-up: deliberate cues after restoring canvas focus

The controller found and fixed a HUD-opener path where native dialog close restored button focus, setting audio inactive and clipping a cue started before close. Re-reviewed `src/app/game-actions.js:36`, `src/app/game-actions.js:100` and `src/app/game-session.js:167`: collection and peace completion now close first and pass paper/success to `focusGame(cue)`; its guarded animation-frame callback focuses canvas, synchronizes input/audio mode, then emits the cue. No rule, save or UI contract changed.

A narrow harness executed the actual action handlers and the source-extracted scheduling method: no early cue, close → schedule, frame focus → sync → cue, and cancellation if a modal opens or the run stops before the frame. Native browser close-event timing and actual output after the HUD opener remain controller PCM checks, not inferred from that harness. No new evidence-backed blocker found.

Also checked `index.html:7`: favicon references the existing local emblem. Existing final `dist/index.html` references the deduplicated hashed local favicon and application bundle `index-DE-mEXGN.js`. Controller reports final 23-test/build checks green; reviewer did not repeat the full build for this bounded follow-up.

## Plan follow-up

Phase 1 and production implementations of phases 2–4 are present. Both findings are resolved with narrow verification. Phase 5 remains contingent on actual browser/production/offline evidence and documentation/plan synchronization. Do not infer completion from stale phase status or prototype reports. Reviewer did not edit plan state.

## Unresolved questions

No unresolved code-review blocker or product decision. Browser-specific suspended-context recovery and actual PCM output remain browser-validation limits, not claimed by the adapter test.

Status: DONE

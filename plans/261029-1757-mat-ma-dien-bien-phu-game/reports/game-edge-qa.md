# Game edge QA — 2026-10-29

## Summary

Status: DONE. No unresolved defect found in assigned edge scope. Earlier cosmetic favicon 404 resolved by controller; final production icon request returns 200. No uncaught page errors (`errors` empty in both QA sessions).

Browser: isolated agent-browser Chromium sessions `dbp-verify` and extended `dbp-storage`. Did not operate `dbp-game` or `dbp-design`. Read `ck:agent-browser` SKILL and installed CLI core/full workflow before CLI use. No source/test edits, no valid progress fixture injection, no debug setters. State inspection used `window.gameDebug.getSnapshot()`.

Targets: dev `http://127.0.0.1:5173/`; final production preview `http://127.0.0.1:4173/`, entry `assets/index-DaZXG46G.js`. Build/test execution belongs to controller; this report covers browser checks.

## Findings

| Check | Observed result |
| --- | --- |
| Fresh title | New Game + Sources; no Continue before save exists. |
| Sources/back | Two source links shown; return restores title and its valid Continue availability. |
| Continue | Reload after legitimate run offers Continue and restores saved preferences/progress. |
| Reset cancel | Cancel preserves museum intro completion, reduced-motion true and volume 1. |
| Reset confirm | Clears completion/settings to defaults; museum intro opens; audio disabled, locked, uninitialized, volume 0.5. |
| Intro VN | First line has disabled Previous; Next advances; final line has Complete. Esc before final action leaves beat incomplete. Native intro completion unlocks museum exit. |
| First clue gate | Production Him Lam clue first line has Next, no Collect; discovery saved with zero collected clues. |
| Interrupted clue resume | Esc then reload/Continue: notebook shows “ĐÃ THẤY · CHƯA GHI”; Read Minh opens at 1/2. |
| Collect | At line 2/2, Ghi manh mối appears. Clicking gives exactly `him-lam-position` and paired `him-lam-position-story` completion. |
| Corrupt JSON | Own-session `{broken` fixture: notice, New Game, no Continue; original corrupt text retained until new run. |
| Future version | Own-session `{version:99}` fixture: invalid-save notice, no Continue; native New starts museum and writes a valid v1 save. |
| Storage write unavailable | Temporary page-scoped `Storage.prototype.setItem` throwing QuotaExceededError, restored in `finally`: reduced-motion checkbox updates session state, prior saved text unchanged, visible “Không thể lưu…” memory-only notice. Movement continues. |

No later chapter progress injected. Independent production route exercised: new → museum intro → walk to exit → Him Lam intro/first clue → interrupted discovery reload → notebook reopen → collect.

## Audio evidence

Signal values come from real Web Audio analyser PCM, not merely node counts. Human speaker quality/loudness not auditioned.

| State | Measured result |
| --- | --- |
| Default | Context uninitialized, unlocked false, enabled false, RMS/peak 0. |
| Explicit enable + game focus, dev | Running; two ambient sources; RMS `0.0041257591`, peak `0.0076921652`. |
| Options modal | No sources, dialogue mode, RMS/peak 0. |
| Volume zero + game focus | Enabled true, volume 0, RMS/peak 0, no sources. |
| Mute + game focus | Enabled false, RMS/peak 0, no sources. |
| Tab out of map | Notebook button gains focus; inactive mode, blocked/paused scene, no sources, RMS/peak 0. |
| Saved enabled true, volume 1; reload/Continue | Preference restored; context uninitialized, unlocked false, running false, no sources, RMS/peak 0; button says Bật lại âm thanh. |
| Explicit enable, final production with external proxy blocked | RMS `0.0041354680`, peak `0.0079016211`, running, two ambient sources. |
| Production after clue reload | Enabled preference true but audio locked/uninitialized, RMS/peak 0; no autoplay. |
| Web Audio API absent before app startup | Native audio click shows “Trình duyệt không hỗ trợ Web Audio. Bạn vẫn có thể chơi bằng văn bản.”; available false, no context/sources/signal; notebook remains usable. |

Window-wide OS blur/hidden and held-key release/bounds extras belong to controller; independent test specifically exercised canvas blur by native Tab.

## Layout evidence

Museum VN screenshots visually inspected. Normal and reduced-motion preferences exercised through settings controls.

| Viewport | Result |
| --- | --- |
| 1280×800 | Document width 1265, dialog bounds x52.5–1212.5, y402.4–778; all VN actions inside viewport, no horizontal overflow. Small page vertical scroll is present. |
| 375×812 | Document 375×812; dialog x20–355, y273.7–800; all VN actions visible, no horizontal overflow. |
| 640×400 | Document width 625; dialog x20–605, y12–388. Dialog client height374/scroll height394; normal vertical scrolling, no horizontal overflow; all VN action buttons inside viewport. Options has more content and scrolls to its lower actions. |
| Actual browser Page zoom 200% | Set Chrome `chrome://settings/appearance` Page zoom to 200% through its select. DPR2, visualViewport.scale1, outerWidth1280, CSS viewport632×284. Notebook and clue VN dialog x20–604.5, y12–272.5; scrollWidth=clientWidth575, no horizontal overflow. VN has vertical scrollbar, readable text; notebook clue button opens VN after scrolling. Browser zoom reverted to100%. |

Screenshot evidence retained with the project:

- [Desktop VN](qa-desktop-vn.png).
- [Phone VN](qa-phone-vn.png).
- [Short viewport VN](qa-short-viewport-vn.png).
- [Short viewport options with scrollbar](qa-short-viewport-options.png).
- [Actual browser 200% zoom clue VN](qa-browser-zoom-200.png).

CLI offscreen-ref clicks sometimes report Done without activating a clipped control. Explicit `scrollintoview` then click works; this is an automation limitation, not reported as a game defect.

## Production and external-network isolation

Initial production request capture: main document, final game bundle, local Phaser/runtime chunks, stylesheet, emblem and portrait all served from `127.0.0.1:4173` (200); engine helper images embedded `data:` URLs. No application-origin external request found. Controller fixed initial favicon404: after fresh request-log clear and reload, icon link resolves to `/assets/game-emblem-szYcCby_.png`, icon request200, no fresh `/favicon.ico` request. Final entry bundle hash unchanged.

Stronger isolated-browser test used these actual commands:

```powershell
agent-browser --session dbp-verify close
agent-browser --session dbp-verify --proxy http://127.0.0.1:9 --proxy-bypass 'localhost,127.0.0.1' open http://127.0.0.1:4173/
agent-browser --session dbp-verify network requests
```

This starts a fresh browser with an unreachable proxy for external hosts and loopback bypass; no system/browser-global network configuration changed. Verification in that page:

- `fetch('https://example.com/', {mode:'no-cors'})` failed with `Failed to fetch`.
- `fetch('/assets/index-DaZXG46G.js', {cache:'no-store'})` returned 200.
- Native New/intro, actual museum exit, first Him Lam clue, reload/Continue/notebook/collect and real PCM all passed under the proxy condition.
- App resource entries after reload contain no external resource names. Only deliberate external connectivity probe appears in the network log.

This is external-network isolation while a local server remains available. It does not claim `file://`, service-worker installation, or full game play without a localhost server.

## Methods and interruptions

Commands used snapshot/ref discovery then native CLI click/press/check, `set viewport`, `screenshot`, `scrollintoview`, `reload`, `network requests` and base64 `eval -b`. PowerShell base64 avoids CLI stdin/quoting issues. Fault fixtures only changed this session's own localStorage. Storage fault injection restored the native method immediately.

CLI `keydown ArrowRight`/`keydown d` did not generate usable code-based movement here. Movement sample therefore dispatched DOM KeyboardEvents to the actual canvas listener with `key:'d',code:'KeyD'`, then window keyup after elapsed frames. No player position/state/physics setters used. Example 2.8 s hold moved museum x380 → x1103.67, exposed unlocked exit, camera x320; native E entered Him Lam. Controller independently covers full journey and bounds.

Dev HMR reloads interrupted two walking attempts while controller made reviewed fixes. Controller confirmed the edits/reloads. Those attempts excluded from pass/fail conclusions; final production is immutable and completed the independent sample above.

## Extended full journey with browser capabilities unavailable

Fresh isolated `dbp-storage` browser used the same unreachable external proxy with localhost bypass. Before game boot, its own target received a CDP `Page.enable` / `Page.addScriptToEvaluateOnNewDocument` fixture; then `Page.reload(ignoreCache:true)`:

```javascript
Object.defineProperty(globalThis, 'localStorage', {
  configurable: true,
  get() { throw new DOMException('QA browser storage denied', 'SecurityError'); }
});
globalThis.AudioContext = undefined;
globalThis.webkitAudioContext = undefined;
```

Removed the preload script after boot; document fixture remained active throughout the run. This only affected the disposable QA tab; no product files, browser-global APIs or system settings changed. Storage remained denied at ending, confirmed by actual getter throwing SecurityError. Audio snapshot remained available false/uninitialized.

Read and installed controller's QA-only `browser-journey-driver.js` through base64 eval. Reviewed driver: operates real canvas key handlers, rendered narrative/puzzle buttons and select change events; contains no save/state/position writes. Executed `read`, actual `walk`, `interact`, three `room` runs and chapter `exit` operations. Each room uses actual exploration/collection and rendered reorder/select/submit controls.

Observed milestones:

| Milestone | Evidence |
| --- | --- |
| Startup with storage denied | Clear cannot-read-save notice, New button, no crash. |
| Museum → Him Lam | Intro complete, exit walked and interacted, Him Lam intro read. |
| Him Lam solved | Four clues, completedRoomIds `[him-lam]`. |
| Campaign solved | Seven total clues, completedRoomIds `[him-lam,campaign-map]`. |
| Command post solved | Ten total clues, first three rooms complete. |
| Peace | No optional clues discovered/collected; all opinion checkboxes unchecked; reflection value empty. Continued through rendered button. |
| Ending | Walked peace exit; ending-intro completed; four completedRoomIds; final museum summary visible; storage getter still throws SecurityError, `audio.available` false, errors log empty. |

This extends the independent sample to the full production journey under simultaneously unavailable persistent storage, unavailable Web Audio, and externally blocked networking. It does not test reload persistence when storage is unavailable, since persistence is intentionally impossible in that condition.

Ending screenshot: [Unavailable-capabilities ending](game-unavailable-capabilities-ending.png), copied from the tester's original screenshot into the handoff directory.

## Recommendations

No further fix requested. Earlier optional favicon polish was implemented and rechecked successfully.

## Unresolved questions

None in assigned scope. Normal-storage per-chapter resume, camera extremes and OS window blur are separately covered by controller; extended unavailable-capabilities full route is independently covered above.

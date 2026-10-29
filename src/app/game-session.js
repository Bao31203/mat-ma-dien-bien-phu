import { chapters } from '../content/story-data.js';
import { getMap } from '../content/world-data.js';
import { createInitialState, applyAction } from '../core/game-rules.js';
import { loadSave, writeSave, clearSave } from '../core/save-store.js';
import { resolveCheckpoint } from '../core/world-geometry.js';
import { AudioController } from '../audio/audio-controller.js';
import { GameInterface } from '../ui/game-interface.js';
import { handleGameIntent, interactWithTarget, enterExit } from './game-actions.js';

export class GameSession {
  constructor() {
    this.state = this.initialState();
    this.started = false;
    this.ready = false;
    this.scene = null;
    this.nearby = null;
    this.pendingIntent = null;
    this.lastNotice = null;
    this.modalOpen = false;
    this.audioRequest = 0;
    this.audioDesired = null;
    try { this.storage = window.localStorage; } catch { this.storage = null; }
    const saved = loadSave(this.storage);
    this.savedState = saved.state;
    this.audio = new AudioController({ onStatusChange: () => this.ui?.render(this.state, this.nearby, this.audio.getSnapshot()) });
    this.audio.setPreferences(this.state.settings);
    this.ui = new GameInterface({
      getState: () => this.state,
      getAudioState: () => this.audio.getSnapshot(),
      onIntent: intent => handleGameIntent(this, intent),
      onModalChange: blocked => {
        this.modalOpen = blocked;
        this.syncInput();
        if (!blocked && !this.started) queueMicrotask(() => this.restoreMenu());
      }
    });
    this.listenForFocus();
    this.ui.render(this.state, null, this.audio.getSnapshot());
    this.ui.showMainMenu({ canContinue: Boolean(this.savedState), notice: saved.notice });
    Object.defineProperty(window, 'gameDebug', { value: Object.freeze({
      getSnapshot: () => structuredClone({ state: this.state, started: this.started,
        scene: this.scene?.getSnapshot() || null, audio: this.audio.getSnapshot(), modal: this.ui.isOpen() })
    }) });
  }

  initialState() {
    return createInitialState({ settings: { reducedMotion: matchMedia('(prefers-reduced-motion: reduce)').matches } });
  }

  getSceneCallbacks() {
    return {
      getState: () => this.state,
      onReady: scene => {
        this.scene = scene;
        this.ready = true;
        this.render();
        this.syncInput();
        if (!this.started && !this.ui.isOpen()) this.restoreMenu();
        if (this.pendingIntent) {
          const intent = this.pendingIntent;
          this.pendingIntent = null;
          handleGameIntent(this, intent);
        }
      },
      onInteract: target => interactWithTarget(this, target),
      onExit: exit => enterExit(this, exit),
      onNearby: target => { this.nearby = target; this.ui?.render(this.state, target, this.audio.getSnapshot()); },
      onMotion: motion => { if (this.started) this.audio.reportMotion(motion); },
      onCheckpoint: ({ chapterId, checkpointId }) => {
        if (!this.started || chapterId !== this.state.chapterId) return;
        const map = getMap(chapterId);
        const checkpoint = resolveCheckpoint(map, checkpointId);
        if (map?.checkpoints.some(item => item.id === checkpointId) && checkpoint?.id === checkpointId) {
          this.commit({ type: 'reach-checkpoint', chapterId, checkpointId });
        }
      }
    };
  }

  listenForFocus() {
    const refresh = () => queueMicrotask(() => this.syncInput());
    document.addEventListener('focusin', refresh);
    document.addEventListener('focusout', refresh);
    document.addEventListener('visibilitychange', refresh);
    window.addEventListener('focus', refresh);
    window.addEventListener('blur', () => {
      this.scene?.setInputBlocked(true);
      this.audio.setMode('inactive');
    });
  }

  restoreMenu() {
    if (!this.started && !this.ui.isOpen()) this.ui.showMainMenu({ canContinue: Boolean(this.savedState) });
  }

  syncInput() {
    const focused = document.activeElement?.tagName === 'CANVAS' && document.hasFocus();
    const modal = this.modalOpen || this.ui?.isOpen() || false;
    const inactive = !this.started || document.hidden || !document.hasFocus();
    this.scene?.setInputBlocked(inactive || modal || !focused);
    this.audio.setMode(inactive ? 'inactive' : modal ? 'dialogue' : focused ? 'exploration' : 'inactive');
  }

  render() {
    this.scene?.refreshProgress(this.state);
    this.scene?.applySettings(this.state.settings);
    this.audio.setPreferences(this.state.settings);
    this.ui.render(this.state, this.nearby, this.audio.getSnapshot());
  }

  commit(action, { save = true } = {}) {
    const next = applyAction(this.state, action);
    if (next === this.state) return false;
    this.state = next;
    this.render();
    if (save && this.started) this.persist();
    return true;
  }

  persist() {
    const result = writeSave(this.storage, this.state);
    if (result.ok) this.savedState = this.state;
    else if (result.notice !== this.lastNotice) {
      this.lastNotice = result.notice;
      this.ui.showToast(result.notice);
    }
  }

  newRun() {
    this.audioRequest += 1;
    this.audioDesired = null;
    this.audio.setMode('inactive');
    this.state = this.initialState();
    this.audio.setPreferences(this.state.settings);
    const result = clearSave(this.storage);
    this.savedState = null;
    this.started = true;
    this.lastNotice = null;
    this.ui.close();
    this.enterCurrentChapter();
    if (result.notice) this.ui.showToast(result.notice);
  }

  continueRun() {
    if (!this.savedState) return;
    const checkpoint = resolveCheckpoint(getMap(this.savedState.chapterId), this.savedState.checkpointId);
    if (!checkpoint) { this.ui.showToast('Chưa tìm được điểm trở lại an toàn. Hãy bắt đầu lượt mới.'); return; }
    this.state = { ...this.savedState, checkpointId: checkpoint.id };
    this.started = true;
    this.ui.close();
    this.enterCurrentChapter();
    if (this.state.settings.audioEnabled) this.ui.showToast('Đã tiếp tục hành trình. Bấm Bật lại âm thanh nếu muốn nghe tiếng.');
  }

  enterCurrentChapter() {
    this.nearby = null;
    this.scene.setInputBlocked(true);
    this.scene.enterChapter(this.state.chapterId, this.state.checkpointId);
    this.render();
    this.persist();
    const intro = chapters[this.state.chapterId].introBeatId;
    if (!this.state.completedBeatIds.includes(intro)) this.ui.showStory(this.state.chapterId);
    else if (this.state.chapterId === 'ending') this.ui.showEnding();
    else this.focusGame();
  }

  focusGame(cue) {
    requestAnimationFrame(() => {
      if (!this.started || this.ui.isOpen()) return;
      document.querySelector('#game-host canvas')?.focus({ preventScroll: true });
      this.syncInput();
      if (cue) this.audio.playCue(cue);
    });
  }

  async toggleAudio(desired) {
    const snapshot = this.audio.getSnapshot();
    const effective = this.audioDesired ?? (this.state.settings.audioEnabled && snapshot.running);
    const enabled = desired ?? !effective;
    const request = ++this.audioRequest;
    this.audioDesired = enabled;
    if (enabled) {
      const result = await this.audio.unlockFromGesture();
      if (request !== this.audioRequest) return;
      if (!result.ok) {
        this.audioDesired = null;
        this.ui.showToast(result.notice);
        this.render();
        return;
      }
    }
    if (request !== this.audioRequest) return;
    this.audioDesired = null;
    this.commit({ type: 'set-settings', settings: { audioEnabled: enabled } });
    this.audio.setPreferences(this.state.settings);
    this.render();
    if (!this.ui.isOpen()) this.focusGame();
    this.syncInput();
  }
}

import test from 'node:test';
import assert from 'node:assert/strict';
import { createInitialState, applyAction } from '../src/core/game-rules.js';
import { SAVE_KEY, loadSave, writeSave, clearSave } from '../src/core/save-store.js';

function memoryStorage() {
  const entries = new Map();
  return { entries, getItem: key => entries.get(key) ?? null, setItem: (key, value) => entries.set(key, value), removeItem: key => entries.delete(key) };
}

test('round trip resumes unfinished discovery and preferences without persisting runtime data', () => {
  const storage = memoryStorage();
  let state = createInitialState({ settings: { audioEnabled: true, audioVolume: 0.25 } });
  for (const action of [{ type: 'complete-beat', beatId: 'museum-intro' }, { type: 'enter-chapter', chapterId: 'him-lam' }, { type: 'discover-clue', clueId: 'him-lam-position' }, { type: 'reach-checkpoint', chapterId: 'him-lam', checkpointId: 'far-safe' }]) state = applyAction(state, action);
  assert.deepEqual(writeSave(storage, { ...state, audioUnlocked: true, reflection: 'Riêng tư', activeBeatId: 'him-lam-position-story', lineIndex: 1 }), { ok: true, notice: null });
  const loaded = loadSave(storage);
  assert.deepEqual(loaded, { state, notice: null });
  assert.equal(loaded.state.collectedClueIds.length, 0);
  const serialized = storage.entries.get(SAVE_KEY);
  for (const key of ['audioUnlocked', 'reflection', 'activeBeatId', 'lineIndex']) assert.equal(serialized.includes(key), false);
  assert.equal(loaded.state.settings.audioEnabled, true);
});

test('bad JSON, unknown versions and invalid progress remain stored for explicit reset', () => {
  for (const serialized of ['{broken', 'null', '[]', JSON.stringify({ ...createInitialState(), version: 99 }), JSON.stringify({ ...createInitialState(), completedRoomIds: ['peace'] })]) {
    const storage = memoryStorage();
    storage.entries.set(SAVE_KEY, serialized);
    const result = loadSave(storage);
    assert.equal(result.state, null);
    assert.equal(typeof result.notice, 'string');
    assert.equal(storage.entries.get(SAVE_KEY), serialized);
  }
});

test('storage access failures and throwing method getters never escape', () => {
  const blocked = { getItem() { throw new Error('blocked'); }, setItem() { throw new Error('quota'); }, removeItem() { throw new Error('blocked'); } };
  const getters = {};
  for (const name of ['getItem', 'setItem', 'removeItem']) Object.defineProperty(getters, name, { get() { throw new Error('blocked property'); } });
  for (const storage of [undefined, null, {}, blocked, getters]) {
    assert.equal(loadSave(storage).state, null);
    assert.equal(typeof loadSave(storage).notice, 'string');
    assert.equal(writeSave(storage, createInitialState()).ok, false);
    assert.equal(clearSave(storage).ok, false);
  }
});

test('invalid writes do not replace a good save; successful reset removes Continue eligibility', () => {
  const storage = memoryStorage();
  assert.deepEqual(loadSave(storage), { state: null, notice: null });
  assert.equal(writeSave(storage, createInitialState()).ok, true);
  assert.ok(loadSave(storage).state);
  const previous = storage.entries.get(SAVE_KEY);
  assert.equal(writeSave(storage, { ...createInitialState(), chapterId: 'peace' }).ok, false);
  assert.equal(storage.entries.get(SAVE_KEY), previous);
  assert.deepEqual(clearSave(storage), { ok: true, notice: null });
  assert.deepEqual(loadSave(storage), { state: null, notice: null });
});

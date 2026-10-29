import test from 'node:test';
import assert from 'node:assert/strict';
import { chapters, clues, beats, puzzles, roomOrder, sources } from '../src/content/story-data.js';
import { applyAction, canEnterChapter, createInitialState, evaluatePuzzle, validateSave } from '../src/core/game-rules.js';

const act = (state, type, data = {}) => applyAction(state, { type, ...data });
const open = () => act(act(createInitialState(), 'complete-beat', { beatId: 'museum-intro' }), 'enter-chapter', { chapterId: 'him-lam' });
function collectRoom(state) {
  for (const clueId of chapters[state.chapterId].clueIds) {
    state = act(state, 'discover-clue', { clueId });
    state = act(state, 'collect-clue', { clueId });
  }
  return state;
}
function solve(state) {
  return act(collectRoom(state), 'submit-puzzle', { puzzleId: state.chapterId, answer: structuredClone(puzzles[state.chapterId].answerSpec) });
}

test('the complete story progresses through four rooms and returns to the museum ending', () => {
  let state = createInitialState({ settings: { reducedMotion: true } });
  assert.equal(state.settings.reducedMotion, true);
  assert.equal(state.settings.audioEnabled, false);
  assert.equal(canEnterChapter(state, 'him-lam'), false);
  assert.equal(act(state, 'enter-chapter', { chapterId: 'him-lam' }), state);
  state = act(state, 'complete-beat', { beatId: 'museum-intro' });
  for (const roomId of roomOrder) {
    state = act(state, 'enter-chapter', { chapterId: roomId });
    assert.equal(state.chapterId, roomId);
    assert.equal(state.checkpointId, 'entry');
    state = act(state, 'complete-beat', { beatId: chapters[roomId].introBeatId });
    state = collectRoom(state);
    state = roomId === 'peace' ? act(state, 'finish-peace') : act(state, 'submit-puzzle', { puzzleId: roomId, answer: puzzles[roomId].answerSpec });
    assert.deepEqual(state.completedRoomIds, roomOrder.slice(0, roomOrder.indexOf(roomId) + 1));
    assert.ok(validateSave(state));
  }
  state = act(state, 'enter-chapter', { chapterId: 'ending' });
  state = act(state, 'complete-beat', { beatId: 'ending-intro' });
  assert.equal(state.chapterId, 'ending');
  assert.ok(state.completedBeatIds.includes('ending-intro'));
  assert.ok(validateSave(state));
  assert.equal(act(state, 'finish-peace'), state);
});

test('discovery is not collection; clue completion is atomic, resumable and idempotent', () => {
  const state = open();
  const clueId = 'him-lam-position';
  const beatId = clues[clueId].beatId;
  assert.equal(act(state, 'collect-clue', { clueId }), state);
  assert.equal(act(state, 'complete-beat', { beatId }), state);
  assert.equal(act(state, 'discover-clue', { clueId: 'command-report' }), state);
  const discovered = act(state, 'discover-clue', { clueId });
  assert.deepEqual(discovered.collectedClueIds, []);
  const resumed = validateSave(discovered);
  assert.deepEqual(resumed.discoveredClueIds, [clueId]);
  const collected = act(resumed, 'collect-clue', { clueId });
  assert.deepEqual(collected.collectedClueIds, [clueId]);
  assert.deepEqual(collected.completedBeatIds, ['museum-intro', beatId]);
  assert.equal(act(collected, 'collect-clue', { clueId }), collected);
  assert.equal(act(collected, 'discover-clue', { clueId }), collected);
  assert.equal(act(discovered, 'complete-beat', { beatId }), discovered);
  assert.deepEqual(state.discoveredClueIds, []);
});

test('Him Lam requires four collected cards, exact order and no duplicated or unknown cards', () => {
  const answer = { orderedStageIds: ['position', 'artillery', 'infantry', 'victory'] };
  const required = chapters['him-lam'].clueIds;
  assert.equal(evaluatePuzzle('him-lam', answer, required).ok, true);
  for (let index = 0; index < required.length; index++) assert.equal(evaluatePuzzle('him-lam', answer, required.filter((_, i) => i !== index)).messageKey, 'missing-clues');
  for (const orderedStageIds of [[], ['position', 'artillery', 'infantry'], ['artillery', 'position', 'infantry', 'victory'], ['position', 'artillery', 'infantry', 'infantry'], ['position', 'artillery', 'infantry', 'unknown']]) {
    assert.equal(evaluatePuzzle('him-lam', { orderedStageIds }, required).ok, false);
  }
  let discovered = open();
  for (const clueId of required) discovered = act(discovered, 'discover-clue', { clueId });
  assert.equal(act(discovered, 'submit-puzzle', { puzzleId: 'him-lam', answer }), discovered);
  const completed = solve(discovered);
  assert.deepEqual(completed.completedRoomIds, ['him-lam']);
  assert.equal(act(completed, 'submit-puzzle', { puzzleId: 'him-lam', answer }), completed);
});

test('campaign placement and timeline must both be right; telegram needs its date', () => {
  const campaign = puzzles['campaign-map'];
  for (const answer of [null, {}, { ...campaign.answerSpec, placements: { ...campaign.answerSpec.placements, 'him-lam': 'north' } }, { ...campaign.answerSpec, orderedEventIds: ['opening', 'second', 'victory', 'third'] }]) {
    assert.equal(evaluatePuzzle(campaign.id, answer, campaign.requiredClueIds).ok, false);
  }
  assert.equal(evaluatePuzzle(campaign.id, campaign.answerSpec, campaign.requiredClueIds).ok, true);
  const telegram = puzzles['command-post'];
  assert.equal(evaluatePuzzle(telegram.id, { ...telegram.answerSpec, date: '1954-03-13' }, telegram.requiredClueIds).ok, false);
  assert.equal(evaluatePuzzle(telegram.id, { ...telegram.answerSpec, orderedFragmentIds: ['advance', 'advance', 'capture'] }, telegram.requiredClueIds).ok, false);
  assert.equal(evaluatePuzzle(telegram.id, telegram.answerSpec, telegram.requiredClueIds).ok, true);
  assert.equal(evaluatePuzzle('peace', {}, [] ).messageKey, 'unknown-puzzle');
});

test('chapter gates, bounded hints, revisits and checkpoint updates preserve progress', () => {
  let state = open();
  assert.equal(act(state, 'enter-chapter', { chapterId: 'campaign-map' }), state);
  assert.equal(act(state, 'complete-beat', { beatId: 'ending-intro' }), state);
  assert.equal(act(state, 'reach-checkpoint', { chapterId: 'museum', checkpointId: 'far' }), state);
  for (const checkpointId of ['', ' ', 1, 'x'.repeat(81)]) assert.equal(act(state, 'reach-checkpoint', { chapterId: state.chapterId, checkpointId }), state);
  state = act(state, 'reach-checkpoint', { chapterId: state.chapterId, checkpointId: 'east-safe' });
  assert.equal(state.checkpointId, 'east-safe');
  assert.equal(act(state, 'reach-checkpoint', { chapterId: state.chapterId, checkpointId: 'east-safe' }), state);
  for (let count = 0; count < 2; count++) state = act(state, 'use-hint', { puzzleId: 'him-lam' });
  assert.equal(state.hintLevels['him-lam'], 2);
  assert.equal(act(state, 'use-hint', { puzzleId: 'him-lam' }), state);
  assert.equal(act(state, 'use-hint', { puzzleId: 'command-post' }), state);
  state = solve(state);
  state = act(state, 'enter-chapter', { chapterId: 'campaign-map' });
  state = act(state, 'enter-chapter', { chapterId: 'him-lam' });
  assert.equal(state.chapterId, 'him-lam');
  assert.equal(state.checkpointId, 'entry');
  assert.ok(validateSave(state));
});

test('peace permits continuing without optional memories, typed text or a moral answer', () => {
  let state = open();
  for (const chapterId of ['him-lam', 'campaign-map', 'command-post']) {
    state = act(state, 'enter-chapter', { chapterId });
    state = solve(state);
  }
  state = act(state, 'enter-chapter', { chapterId: 'peace' });
  const finished = act(state, 'finish-peace');
  assert.equal(finished.collectedClueIds.some(id => id.startsWith('peace-')), false);
  assert.equal(canEnterChapter(finished, 'ending'), true);
  assert.equal(Object.hasOwn(finished, 'reflection'), false);
  assert.ok(validateSave(finished));
  const ending = act(finished, 'enter-chapter', { chapterId: 'ending' });
  assert.equal(ending.chapterId, 'ending');
  assert.ok(validateSave(ending));
});

test('save validation rejects inconsistent progress and sanitizes session-only fields', () => {
  const state = solve(open());
  const mutations = [
    { version: 2 }, { chapterId: 'ending' }, { chapterId: ['museum'] }, { checkpointId: null },
    { completedRoomIds: ['campaign-map'] }, { completedRoomIds: ['him-lam', 'him-lam'] },
    { discoveredClueIds: ['unknown'] }, { discoveredClueIds: [] }, { collectedClueIds: [] },
    { completedBeatIds: ['museum-intro'] }, { completedBeatIds: [...state.completedBeatIds, 'ending-intro'] },
    { hintLevels: { 'him-lam': 3 } }, { hintLevels: { 'him-lam': NaN } }, { hintLevels: { 'him-lam': 0.5 } }, { hintLevels: { unknown: 1 } },
  ];
  for (const mutation of mutations) assert.equal(validateSave({ ...state, ...mutation }), null, JSON.stringify(mutation));
  for (const audioVolume of [NaN, Infinity, -0.1, 1.1, '0.5', null]) assert.equal(validateSave({ ...state, settings: { ...state.settings, audioVolume } }), null);
  assert.equal(validateSave({ ...state, settings: { ...state.settings, audioEnabled: 'yes' } }), null);
  assert.equal(validateSave({ ...state, settings: { ...state.settings, reducedMotion: 1 } }), null);
  const sanitized = validateSave({ ...state, checkpointId: 'unknown-map-checkpoint', reflection: '<b>private</b>', activeBeatId: 'other', lineIndex: 2, audioUnlocked: true, settings: { ...state.settings, private: true } });
  assert.deepEqual(Object.keys(sanitized).sort(), Object.keys(createInitialState()).sort());
  assert.equal(sanitized.checkpointId, 'unknown-map-checkpoint');
  assert.equal(Object.hasOwn(sanitized.settings, 'private'), false);
  assert.equal(validateSave({ ...createInitialState(), discoveredClueIds: ['him-lam-position'] }), null);
});

test('settings and invalid actions cannot mutate the previous state', () => {
  const state = createInitialState();
  for (const action of [null, {}, { type: 'finish-peace' }, { type: 'enter-chapter', chapterId: ['museum'] }, { type: 'set-settings', settings: { audioVolume: NaN } }]) assert.equal(applyAction(state, action), state);
  const updated = act(state, 'set-settings', { settings: { brightness: 'bright', audioEnabled: true, audioVolume: 0 } });
  assert.deepEqual(updated.settings, { brightness: 'bright', reducedMotion: false, audioEnabled: true, audioVolume: 0 });
  assert.equal(state.settings.brightness, 'normal');
  assert.equal(act(updated, 'set-settings', { settings: { audioVolume: 0 } }), updated);
});

test('every content reference resolves and every clue has meaningful Minh dialogue', () => {
  for (const item of Object.values(clues)) {
    assert.ok(chapters[item.chapterId].clueIds.includes(item.id));
    assert.ok(beats[item.beatId].requiredDiscoveredClueIds.includes(item.id));
    assert.ok(beats[item.beatId].lines.length >= 2);
  }
  for (const item of Object.values(beats)) for (const line of item.lines) {
    assert.equal(line.speakerId, 'minh');
    assert.ok(line.text.length > 40);
    for (const sourceId of line.sourceIds) assert.ok(sources[sourceId]);
  }
});

import { beats, chapters, chapterOrder, clues, puzzles, roomOrder } from '../content/story-data.js';
import { copySettings, defaultSettings, validCheckpoint, validSettings } from './save-validation.js';
export { validateSave } from './save-validation.js';

export function createInitialState(options = {}) {
  const settings = { ...defaultSettings, ...(options.settings ?? options) };
  return {
    version: 1, chapterId: 'museum', checkpointId: 'entry', completedRoomIds: [],
    discoveredClueIds: [], collectedClueIds: [], completedBeatIds: [], hintLevels: {},
    settings: validSettings(settings) ? copySettings(settings) : { ...defaultSettings },
  };
}

export function canEnterChapter(state, chapterId) {
  if (typeof chapterId !== 'string' || !Object.hasOwn(chapters, chapterId)) return false;
  if (chapterId === 'museum') return true;
  if (!state.completedBeatIds.includes('museum-intro')) return false;
  return chapterOrder.indexOf(chapterId) <= state.completedRoomIds.length + 1;
}

const sameSequence = (actual, expected) => Array.isArray(actual) && actual.length === expected.length && actual.every((id, index) => id === expected[index]);
export function evaluatePuzzle(puzzleId, answer, collectedClueIds) {
  const puzzle = typeof puzzleId === 'string' && Object.hasOwn(puzzles, puzzleId) ? puzzles[puzzleId] : null;
  if (!puzzle) return { ok: false, messageKey: 'unknown-puzzle' };
  if (!Array.isArray(collectedClueIds) || puzzle.requiredClueIds.some(id => !collectedClueIds.includes(id))) return { ok: false, messageKey: 'missing-clues' };
  if (!answer || typeof answer !== 'object' || Array.isArray(answer)) return { ok: false, messageKey: 'incorrect-answer' };
  const expected = puzzle.answerSpec;
  let ok = false;
  if (puzzle.type === 'sequence') ok = sameSequence(answer.orderedStageIds, expected.orderedStageIds);
  if (puzzle.type === 'campaign') {
    const placements = answer.placements;
    ok = placements !== null && typeof placements === 'object' && !Array.isArray(placements)
      && Object.keys(placements).length === Object.keys(expected.placements).length
      && Object.entries(expected.placements).every(([id, position]) => Object.hasOwn(placements, id) && placements[id] === position)
      && sameSequence(answer.orderedEventIds, expected.orderedEventIds);
  }
  if (puzzle.type === 'telegram') ok = sameSequence(answer.orderedFragmentIds, expected.orderedFragmentIds) && answer.date === expected.date;
  return { ok, messageKey: ok ? 'puzzle-complete' : 'incorrect-answer' };
}

const add = (values, id) => values.includes(id) ? values : [...values, id];
const lookup = (registry, id) => typeof id === 'string' && Object.hasOwn(registry, id) ? registry[id] : null;
const clueBeatIds = new Set(Object.values(clues).map(clue => clue.beatId));

export function applyAction(state, action) {
  if (!action || typeof action !== 'object') return state;
  switch (action.type) {
    case 'discover-clue': {
      const clue = lookup(clues, action.clueId);
      if (!clue || clue.chapterId !== state.chapterId || state.discoveredClueIds.includes(clue.id)) return state;
      return { ...state, discoveredClueIds: [...state.discoveredClueIds, clue.id] };
    }
    case 'collect-clue': {
      const clue = lookup(clues, action.clueId);
      if (!clue || clue.chapterId !== state.chapterId || !state.discoveredClueIds.includes(clue.id) || state.collectedClueIds.includes(clue.id)) return state;
      return { ...state, collectedClueIds: [...state.collectedClueIds, clue.id], completedBeatIds: add(state.completedBeatIds, clue.beatId) };
    }
    case 'complete-beat': {
      const beat = lookup(beats, action.beatId);
      if (!beat || beat.chapterId !== state.chapterId || clueBeatIds.has(beat.id) || state.completedBeatIds.includes(beat.id)
        || beat.requiredDiscoveredClueIds.some(id => !state.discoveredClueIds.includes(id))) return state;
      return { ...state, completedBeatIds: [...state.completedBeatIds, beat.id] };
    }
    case 'use-hint': {
      const puzzle = lookup(puzzles, action.puzzleId);
      const level = state.hintLevels[action.puzzleId] ?? 0;
      if (!puzzle || puzzle.chapterId !== state.chapterId || level >= puzzle.hints.length) return state;
      return { ...state, hintLevels: { ...state.hintLevels, [puzzle.id]: level + 1 } };
    }
    case 'submit-puzzle': {
      const puzzle = lookup(puzzles, action.puzzleId);
      if (!puzzle || puzzle.chapterId !== state.chapterId || state.completedRoomIds.includes(puzzle.chapterId)
        || roomOrder[state.completedRoomIds.length] !== puzzle.chapterId
        || !evaluatePuzzle(puzzle.id, action.answer, state.collectedClueIds).ok) return state;
      return { ...state, completedRoomIds: [...state.completedRoomIds, puzzle.chapterId] };
    }
    case 'enter-chapter': {
      if (action.chapterId === state.chapterId || !canEnterChapter(state, action.chapterId)) return state;
      if (action.checkpointId !== undefined && !validCheckpoint(action.checkpointId)) return state;
      return { ...state, chapterId: action.chapterId, checkpointId: action.checkpointId ?? 'entry' };
    }
    case 'reach-checkpoint': {
      if (action.chapterId !== state.chapterId || !validCheckpoint(action.checkpointId) || action.checkpointId === state.checkpointId) return state;
      return { ...state, checkpointId: action.checkpointId };
    }
    case 'finish-peace': {
      if (state.chapterId !== 'peace' || state.completedRoomIds.length !== 3) return state;
      return { ...state, completedRoomIds: [...state.completedRoomIds, 'peace'] };
    }
    case 'set-settings': {
      if (!action.settings || typeof action.settings !== 'object' || Array.isArray(action.settings)) return state;
      const settings = { ...state.settings, ...action.settings };
      if (!validSettings(settings) || Object.keys(defaultSettings).every(key => state.settings[key] === settings[key])) return state;
      return { ...state, settings: copySettings(settings) };
    }
    default: return state;
  }
}

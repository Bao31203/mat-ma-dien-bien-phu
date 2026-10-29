import { beats, chapters, clues, puzzles } from '../content/story-data.js';
import { evaluatePuzzle } from '../core/game-rules.js';
import { getMap } from '../content/world-data.js';

export function interactWithTarget(app, target) {
  if (!app.started || !target || app.ui.isOpen()) return;
  if (target.type === 'exit') return enterExit(app, target);
  if (target.type === 'clue') {
    const clue = clues[target.clueId];
    if (!clue || clue.chapterId !== app.state.chapterId) return;
    app.commit({ type: 'discover-clue', clueId: clue.id });
    app.ui.showClue(clue.id);
  } else if (target.type === 'puzzle') {
    app.ui.showPuzzle(target.puzzleId);
  } else if (target.type === 'story' && beats[target.beatId]) {
    app.ui.showNarrative(target.beatId);
  }
  app.audio.playCue('paper');
}

export function enterExit(app, target) {
  if (!app.started || app.ui.isOpen()) return;
  const exit = getMap(app.state.chapterId)?.exits.find(item => item.id === target?.id);
  if (!exit || app.nearby?.id !== exit.id) return;
  const changed = app.commit({
    type: 'enter-chapter', chapterId: exit.toChapterId, checkpointId: exit.spawnId || 'entry'
  }, { save: false });
  if (!changed) {
    app.ui.showToast('Cánh cửa còn khóa. Hãy hoàn thành thử thách trong gian này.');
    app.audio.playCue('error');
    return;
  }
  app.enterCurrentChapter();
}

function finishNarrative(app, intent) {
  const current = app.ui.getActiveNarrative();
  if (!current?.lastLine) return;
  if (intent.type === 'collect-clue') {
    const clue = clues[intent.clueId];
    if (!clue || current.clueId !== clue.id || current.beatId !== clue.beatId) return;
    app.commit(intent);
    app.ui.showToast(`Đã ghi: ${clue.title}`);
  } else {
    if (current.beatId !== intent.beatId) return;
    app.commit(intent);
  }
  app.ui.close();
  if (app.state.chapterId === 'ending') app.ui.showEnding();
  else app.focusGame(intent.type === 'collect-clue' ? 'paper' : undefined);
}

function submitPuzzle(app, intent) {
  if (intent.puzzleId !== app.state.chapterId) return;
  const result = evaluatePuzzle(intent.puzzleId, intent.answer, app.state.collectedClueIds);
  if (!result.ok) {
    app.audio.playCue('error');
    app.ui.showPuzzleFeedback(result.messageKey === 'missing-clues'
      ? 'Bạn cần đọc hết và ghi đủ các manh mối trong sổ tay trước khi đối chiếu.'
      : 'Các dữ kiện chưa khớp. Bạn có thể sửa thứ tự, đọc lại sổ tay hoặc xem gợi ý.', 'error');
    return;
  }
  app.commit(intent);
  app.audio.playCue('success');
  app.ui.showPuzzleFeedback('Đúng rồi! Cánh cửa phía đông đã mở. Bạn có thể tiếp tục hành trình.', 'success');
  app.ui.showToast('Một ký ức đã được kết nối. Đi tới cánh cửa phía đông.');
}

export async function handleGameIntent(app, intent) {
  if (!intent || typeof intent !== 'object') return;
  if (['new-game', 'continue', 'confirm-reset'].includes(intent.type) && !app.ready) {
    app.pendingIntent = intent;
    app.ui.showToast('Đang mở không gian ký ức…');
    return;
  }
  switch (intent.type) {
    case 'new-game':
      if (app.savedState || app.started) app.ui.showResetConfirm();
      else app.newRun();
      break;
    case 'continue': app.continueRun(); break;
    case 'confirm-reset': app.newRun(); break;
    case 'focus-game': app.focusGame(); break;
    case 'interact': interactWithTarget(app, app.nearby); break;
    case 'exit': enterExit(app, app.nearby); break;
    case 'read-clue':
      if (app.state.discoveredClueIds.includes(intent.clueId)) app.ui.showClue(intent.clueId);
      break;
    case 'collect-clue':
    case 'complete-beat': finishNarrative(app, intent); break;
    case 'submit-puzzle': submitPuzzle(app, intent); break;
    case 'use-hint': {
      const puzzle = puzzles[intent.puzzleId];
      if (!puzzle || puzzle.chapterId !== app.state.chapterId) break;
      app.commit(intent);
      const level = Math.max(1, app.state.hintLevels[puzzle.id] || 0);
      app.ui.showHint(puzzle.hints[Math.min(level - 1, puzzle.hints.length - 1)]);
      break;
    }
    case 'finish-peace':
      if (app.commit(intent)) {
        app.ui.close();
        app.ui.showToast('Cánh cửa đã mở. Mang điều bạn chọn trở về hiện tại.');
        app.focusGame('success');
      }
      break;
    case 'audio-toggle': await app.toggleAudio(); break;
    case 'set-settings': {
      const settings = { ...intent.settings };
      if (Object.hasOwn(settings, 'audioEnabled')) {
        const desired = settings.audioEnabled;
        delete settings.audioEnabled;
        app.commit({ type: 'set-settings', settings });
        await app.toggleAudio(desired);
      } else app.commit(intent);
      break;
    }
    case 'open-puzzle': app.ui.showPuzzle(chapters[app.state.chapterId]?.puzzleId || 'peace'); break;
    default: break;
  }
}

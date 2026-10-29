// Browser QA only: operates the real canvas inputs and rendered DOM controls.
// It never assigns game state, scene positions, puzzle drafts, or save data.
(() => {
  const pause = ms => new Promise(resolve => setTimeout(resolve, ms));
  const snapshot = () => window.gameDebug.getSnapshot();
  const canvas = () => document.querySelector('#game-host canvas');
  async function click(selector) {
    const target = document.querySelector(selector);
    if (!target || target.disabled) throw new Error(`Unavailable control: ${selector}`);
    target.scrollIntoView({ block: 'center' }); target.click(); await pause(130);
  }
  async function textButton(label) {
    const button = [...document.querySelectorAll('#game-dialog button')].find(item => item.textContent === label);
    if (!button) throw new Error(`Missing button: ${label}`);
    button.scrollIntoView({ block: 'center' }); button.click(); await pause(130);
  }
  async function walk(axis, target) {
    canvas().focus(); await pause(100);
    const positive = target > snapshot().scene.player[axis];
    const key = axis === 'x' ? positive ? 'd' : 'a' : positive ? 's' : 'w';
    const code = `Key${key.toUpperCase()}`;
    canvas().dispatchEvent(new KeyboardEvent('keydown', { key, code, bubbles: true, cancelable: true }));
    const limit = performance.now() + 12000;
    try {
      while (performance.now() < limit) {
        const value = snapshot().scene.player[axis];
        if (positive ? value >= target : value <= target) return;
        await pause(20);
      }
      throw new Error(`Walking blocked: ${axis}=${target}, actual=${snapshot().scene.player[axis]}`);
    } finally {
      window.dispatchEvent(new KeyboardEvent('keyup', { key, code, bubbles: true })); await pause(100);
    }
  }
  async function interact() {
    canvas().focus(); await pause(100);
    canvas().dispatchEvent(new KeyboardEvent('keydown', { key: 'e', code: 'KeyE', bubbles: true, cancelable: true }));
    window.dispatchEvent(new KeyboardEvent('keyup', { key: 'e', code: 'KeyE', bubbles: true })); await pause(160);
  }
  async function read() { await textButton('Đọc toàn cảnh'); await click('#narrative-next'); }
  async function collect() { await interact(); await read(); }
  async function select(name, value) {
    const control = document.querySelector(`select[name="${name}"]`);
    control.value = value; control.dispatchEvent(new Event('change', { bubbles: true })); await pause(80);
  }
  async function solve(id) {
    await click('#puzzle-button');
    const orders = { 'him-lam': ['position', 'artillery', 'infantry', 'victory'],
      'campaign-map': ['opening', 'second', 'third', 'victory'],
      'command-post': ['advance', 'headquarters', 'capture'] };
    for (let index = 0; index < orders[id].length; index++) {
      while ([...document.querySelectorAll('[data-item-id]')].findIndex(item => item.dataset.itemId === orders[id][index]) > index) {
        await click(`[data-item-id="${orders[id][index]}"] [data-move="up"]`);
      }
    }
    if (id === 'campaign-map') {
      await select('him-lam', 'north-east'); await select('doc-lap', 'north'); await select('muong-thanh', 'center');
    }
    if (id === 'command-post') await select('date', '1954-05-07');
    await click('#puzzle-submit');
    if (!snapshot().state.completedRoomIds.includes(id)) throw new Error(`Puzzle failed: ${id}`);
    (window.__qaCueEvidence ||= []).push({ chapter: id, audio: snapshot().audio });
    await click('[data-ui-action="close"]');
  }
  async function room() {
    const id = snapshot().state.chapterId;
    if (!['him-lam', 'campaign-map', 'command-post'].includes(id)) throw new Error('Expected graded room');
    await collect(); await walk('y', 680); await walk('x', 1270); await walk('y', 360); await collect();
    await walk('y', 680);
    if (id !== 'campaign-map') { await walk('x', 1950); await collect(); }
    if (id !== 'command-post') { await walk('x', 350); await walk('y', 920); await collect(); await walk('y', 680); }
    await solve(id);
    return snapshot();
  }
  async function exit() { await walk('x', 2160); await interact(); await read(); return snapshot(); }
  window.__journeyQA = Object.freeze({ pause, snapshot, click, textButton, walk, interact, read, collect, solve, room, exit, select });
})();

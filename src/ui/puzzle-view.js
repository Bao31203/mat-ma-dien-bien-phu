import { puzzles } from '../content/story-data.js';
import { element, button, paragraph, field, actions } from './dom-elements.js';

const scramble = items => items.length === 4 ? [items[1], items[3], items[0], items[2]] : [items.at(-1), ...items.slice(0, -1)];

export class PuzzleView {
  constructor({ dialog, getState, onIntent }) {
    this.dialog = dialog; this.getState = getState; this.onIntent = onIntent;
    this.drafts = new Map(); this.activeId = null;
  }

  show(puzzleId) {
    if (puzzleId === 'peace') { this.showPeace(); return; }
    const puzzle = puzzles[puzzleId];
    if (!puzzle) return;
    this.activeId = puzzleId;
    if (!this.drafts.has(puzzleId)) {
      const items = puzzle.stages || puzzle.events || puzzle.fragments;
      this.drafts.set(puzzleId, { order: [...(puzzle.initialOrder || puzzle.scramble || scramble(items.map(item => item.id)))], placements: {}, date: '' });
    }
    const draft = this.drafts.get(puzzleId);
    const state = this.getState();
    const missing = puzzle.requiredClueIds.filter(id => !state.collectedClueIds.includes(id));
    const completed = state.completedRoomIds.includes(puzzle.chapterId);
    const content = element('div', { className: 'puzzle-content' }, paragraph(puzzle.instruction));
    const form = element('form', { id: 'puzzle-form', onSubmit: event => {
      event.preventDefault();
      const answer = puzzle.type === 'sequence' ? { orderedStageIds: [...draft.order] } : puzzle.type === 'campaign' ? { placements: { ...draft.placements }, orderedEventIds: [...draft.order] } : { orderedFragmentIds: [...draft.order], date: draft.date };
      this.onIntent({ type: 'submit-puzzle', puzzleId, answer });
    } });
    if (puzzle.type === 'campaign') form.append(this.campaignMap(puzzle, draft));
    const items = puzzle.stages || puzzle.events || puzzle.fragments;
    form.append(this.orderedCards(items, draft, puzzleId));
    if (puzzle.type === 'telegram') {
      const select = element('select', { name: 'date', required: true, onChange: event => { draft.date = event.target.value; } }, element('option', { value: '' }, 'Chọn ngày theo tư liệu'));
      for (const option of puzzle.dateOptions) select.append(element('option', { value: option.id, selected: option.id === draft.date }, option.label));
      form.append(field(puzzle.dateLabel, select));
    }
    form.append(paragraph(completed ? '✓ Hồ sơ đã hoàn tất. Bạn có thể trở lại bản đồ và đi qua cửa.' : missing.length ? `Còn ${missing.length} manh mối chưa ghi. Sổ tay chỉ đường và giữ lời kể đã khám phá.` : 'Đã có đủ manh mối. Đối chiếu khi bạn sẵn sàng.', 'puzzle-lock'));
    this.feedback = element('div', { id: 'puzzle-feedback', role: 'status', 'aria-live': 'polite' });
    const submit = element('button', { type: 'submit', className: 'primary-button', id: 'puzzle-submit', disabled: missing.length > 0 || completed }, 'Đối chiếu hồ sơ →');
    form.append(this.feedback, actions(submit, button('Xem gợi ý', () => this.onIntent({ type: 'use-hint', puzzleId })), button('Đọc sổ tay', () => document.dispatchEvent(new CustomEvent('game-open-notebook')))));
    content.append(form);
    this.dialog.show({ title: puzzle.title, kicker: 'HỒ SƠ KÝ ỨC', content });
  }

  orderedCards(items, draft, puzzleId) {
    const list = element('ol', { className: 'sequence-cards', id: 'sequence-cards' });
    draft.order.forEach((id, index) => {
      const item = items.find(entry => entry.id === id);
      const card = element('li', { className: 'sequence-card', tabIndex: -1, dataset: { itemId: id } }, element('span', { className: 'sequence-number' }, index + 1), element('h3', {}, item.label));
      const move = direction => {
        const target = index + (direction === 'up' ? -1 : 1);
        if (target < 0 || target >= draft.order.length) return;
        [draft.order[index], draft.order[target]] = [draft.order[target], draft.order[index]];
        this.show(puzzleId);
        const movedCard = document.querySelector(`[data-item-id="${id}"]`);
        const sameDirection = movedCard.querySelector(`[data-move="${direction}"]`);
        (sameDirection.disabled ? movedCard : sameDirection).focus({ preventScroll: true });
        document.querySelector('#game-announcement').textContent = `${item.label} ở vị trí ${target + 1}.`;
      };
      card.append(element('div', { className: 'sequence-moves' }, button('↑', () => move('up'), 'move-button', { disabled: index === 0, dataset: { move: 'up' }, 'aria-label': `Đưa ${item.label} lên` }), button('↓', () => move('down'), 'move-button', { disabled: index === draft.order.length - 1, dataset: { move: 'down' }, 'aria-label': `Đưa ${item.label} xuống` })));
      list.append(card);
    });
    return list;
  }

  campaignMap(puzzle, draft) {
    const section = element('section', { className: 'campaign-workspace', 'aria-label': 'Sơ đồ học tập và các ô vị trí' });
    const map = element('div', { className: 'campaign-diagram', 'aria-label': 'Sơ đồ minh họa không theo tỷ lệ' }, element('span', { className: 'map-north' }, 'BẮC ↑'));
    for (const position of puzzle.positions) {
      const names = puzzle.sites.filter(site => draft.placements[site.id] === position.id).map(site => site.label);
      map.append(element('div', { className: `map-slot slot-${position.id}` }, element('strong', {}, position.label), element('span', {}, names.join(' · ') || 'Ô thẻ trống')));
    }
    const controls = element('div', { className: 'placement-fields' });
    for (const site of puzzle.sites) {
      const select = element('select', { name: site.id, required: true, onChange: event => {
        draft.placements[site.id] = event.target.value;
        for (const slot of map.querySelectorAll('.map-slot')) {
          const position = puzzle.positions.find(entry => slot.classList.contains(`slot-${entry.id}`));
          const labels = puzzle.sites.filter(entry => draft.placements[entry.id] === position.id).map(entry => entry.label);
          slot.querySelector('span').textContent = labels.join(' · ') || 'Ô thẻ trống';
        }
      } }, element('option', { value: '' }, 'Chọn ô theo chú giải'));
      for (const option of puzzle.positions) select.append(element('option', { value: option.id, selected: draft.placements[site.id] === option.id }, option.label));
      controls.append(field(site.label, select));
    }
    section.append(map, paragraph('Sơ đồ minh họa, không theo tỷ lệ. Ô vị trí là quy ước học tập; không thể hiện một tuyến tiến quân.', 'diagram-caption'), controls);
    return section;
  }

  showPeace() {
    this.activeId = 'peace';
    const reflection = element('textarea', { id: 'peace-reflection', rows: 3, maxLength: 1200, placeholder: 'Một điều mình muốn mang về… (có thể để trống)' });
    const choices = element('div', { className: 'peace-choices' });
    for (const label of ['Tìm hiểu thêm lịch sử', 'Lắng nghe và giúp đỡ', 'Giữ gìn không gian chung']) {
      choices.append(element('label', { className: 'choice-row' }, element('input', { type: 'checkbox' }), element('span', {}, label)));
    }
    this.dialog.show({ title: 'Điều mình muốn mang về', kicker: 'CÁNH CỬA HÒA BÌNH', content: element('div', {}, paragraph('Có thể đọc thêm những ký ức trong phòng, chọn một điều gần với mình, viết vài dòng, hoặc bước tiếp ngay. Không có đáp án đúng sai.'), choices, field('Một suy nghĩ riêng, không bắt buộc', reflection), paragraph('Những dòng này chỉ nằm trên trang đang mở, không được gửi hoặc lưu vào tiến độ.', 'form-help'), actions(button('Bước qua cánh cửa →', () => this.onIntent({ type: 'finish-peace' }), 'primary-button'), button('Đọc sổ tay', () => document.dispatchEvent(new CustomEvent('game-open-notebook'))))) });
  }

  showFeedback(text, tone = 'error') {
    if (!this.feedback?.isConnected) return;
    this.feedback.replaceChildren(paragraph(text, `feedback ${tone}`));
  }

  clearDrafts() { this.drafts.clear(); this.activeId = null; }
}

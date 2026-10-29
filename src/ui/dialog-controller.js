export class DialogController {
  constructor({ onModalChange, onClose }) {
    this.dialog = document.querySelector('#game-dialog');
    this.body = document.querySelector('#dialog-content');
    this.onModalChange = onModalChange;
    this.onClose = onClose;
    this.opener = null;
    this.dismissible = true;
    this.abort = new AbortController();
    this.dialog.addEventListener('close', () => {
      if (this.dialog.open) return;
      this.onClose?.();
      if (this.dialog.open) return;
      const target = this.opener?.isConnected && !this.opener.disabled ? this.opener : document.querySelector('#game-host');
      target?.focus({ preventScroll: true });
      this.onModalChange(false);
    }, { signal: this.abort.signal });
    this.dialog.addEventListener('click', event => {
      if (event.target !== this.dialog || !this.dismissible) return;
      const bounds = this.dialog.getBoundingClientRect();
      if (event.clientX < bounds.left || event.clientX > bounds.right || event.clientY < bounds.top || event.clientY > bounds.bottom) this.close();
    }, { signal: this.abort.signal });
    this.dialog.addEventListener('cancel', event => {
      if (!this.dismissible) event.preventDefault();
    }, { signal: this.abort.signal });
  }

  show({ title, kicker = '', content, variant = '', focus = null, dismissible = true }) {
    if (!this.dialog.open) {
      this.opener = document.activeElement;
      // Block scene input before focus or native-dialog state can change.
      this.onModalChange(true);
    }
    this.dialog.className = variant;
    this.dismissible = dismissible;
    this.dialog.querySelector('.dialog-close').hidden = !dismissible;
    document.querySelector('#dialog-title').textContent = title;
    document.querySelector('#dialog-kicker').textContent = kicker;
    this.body.replaceChildren(content);
    if (!this.dialog.open) this.dialog.showModal();
    (focus || (dismissible ? this.dialog.querySelector('.dialog-close') : this.body.querySelector('button')))?.focus({ preventScroll: true });
    this.dialog.scrollTop = 0;
  }

  close() { if (this.dialog.open) this.dialog.close(); }
  isOpen() { return this.dialog.open; }
  destroy() { this.abort.abort(); this.close(); }
}

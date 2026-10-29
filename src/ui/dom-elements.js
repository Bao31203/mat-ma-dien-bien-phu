// All content enters the document through text nodes; no save or story text becomes HTML.
export function element(tag, properties = {}, ...children) {
  const node = document.createElement(tag);
  for (const [key, value] of Object.entries(properties)) {
    if (value === undefined || value === null) continue;
    if (key === 'className') node.className = value;
    else if (key === 'dataset') Object.assign(node.dataset, value);
    else if (key.startsWith('on')) node.addEventListener(key.slice(2).toLowerCase(), value);
    else if (key in node && !key.startsWith('aria')) node[key] = value;
    else node.setAttribute(key, String(value));
  }
  for (const child of children.flat(Infinity)) {
    if (child === null || child === undefined || child === false) continue;
    node.append(child instanceof Node ? child : document.createTextNode(String(child)));
  }
  return node;
}

export function button(label, onClick, className = 'quiet-button', properties = {}) {
  return element('button', { type: 'button', className, onClick, ...properties }, label);
}

export function paragraph(text, className = '') {
  return element('p', { className }, text);
}

export function field(label, control) {
  return element('label', { className: 'form-field' }, element('span', {}, label), control);
}

export function actions(...controls) {
  return element('div', { className: 'dialog-actions' }, controls);
}

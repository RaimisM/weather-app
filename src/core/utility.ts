export function el<K extends keyof HTMLElementTagNameMap>(
  tag: K,
  attrs: Record<string, any> = {},
  ...children: (string | Node)[]
): HTMLElementTagNameMap[K] {
  const element = document.createElement(tag);
  for (const [k, v] of Object.entries(attrs)) {
    if (k in element) (element as any)[k] = v;
    else element.setAttribute(k, v);
  }
  for (const child of children) {
    element.append(child);
  }
  return element;
}

export function notify(msg: string, level = 'is-info', timeout = 3000) {
  const container = document.getElementById('notifications');
  if (!container) return;

  const n = document.createElement('div');
  n.className = `notification ${level}`;
  n.textContent = msg;

  container.appendChild(n);

  setTimeout(() => n.remove(), timeout);
}

// ========================================
// utils/helpers.js
// ========================================
export function escapeHtml(str) {
  return String(str)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;');
}

export function icon(name, cls = '') {
  return `<i data-lucide="${name}" class="${cls}"></i>`;
}

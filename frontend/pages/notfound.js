// ========================================
// pages/notfound.js
// ========================================
import { escapeHtml } from '../utils/helpers.js';

export function renderNotFound(title, backAction) {
  return `
    <div class="space-y-6">
      <h1 class="text-4xl font-bold tracking-tight">${escapeHtml(title)}</h1>
      <button
        data-action="${escapeHtml(backAction)}"
        class="px-6 py-3 glass rounded-2xl border border-white/10 hover:bg-white/5 transition-all font-bold"
      >
        ← Back
      </button>
    </div>
  `;
}

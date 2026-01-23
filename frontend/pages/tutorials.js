// ========================================
// pages/tutorials.js (COMPLET)
// ========================================
import { escapeHtml, icon } from '../utils/helpers.js';

export function renderTutorials() {
  const TUTORIALS = window.APP_DATA.TUTORIALS;
  
  const rows = TUTORIALS.map(
    (t) => `
      <div
        class="group p-8 glass rounded-3xl cursor-pointer hover:border-red-500/30 transition-all"
        data-action="gotoTutorial:${escapeHtml(t.id)}"
      >
        <div class="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div class="space-y-3">
            <div class="flex items-center gap-4 text-xs font-mono text-zinc-500">
              <span class="flex items-center gap-1.5">${icon('calendar', 'w-[14px] h-[14px]')} ${escapeHtml(t.date)}</span>
              <span class="flex items-center gap-1.5">${icon('clock', 'w-[14px] h-[14px]')} ${escapeHtml(t.readTime)}</span>
            </div>
            <h3 class="text-2xl font-bold group-hover:text-red-400 transition-colors">${escapeHtml(t.title)}</h3>
            <p class="text-zinc-400 max-w-3xl leading-relaxed">${escapeHtml(t.excerpt)}</p>
          </div>
          <div class="shrink-0">
            <div class="w-12 h-12 glass rounded-full flex items-center justify-center text-zinc-500 group-hover:text-red-400 group-hover:rotate-45 transition-all">
              ${icon('arrow-up-right', 'w-6 h-6')}
            </div>
          </div>
        </div>
      </div>
    `
  ).join('');

  return `
    <div class="space-y-12">
      <div class="space-y-4 max-w-2xl">
        <h1 class="text-4xl font-bold tracking-tight">Technical Knowledge</h1>
        <p class="text-zinc-400 text-lg">
          Sharing insights on AI deployment, hardware integration, and UX for industrial robotics.
        </p>
      </div>

      <div class="grid gap-6">${rows}</div>
    </div>
  `;
}

export function renderTutorialPage(tutorial) {
  const paragraphs = (tutorial.content || '')
    .split('\n\n')
    .filter(Boolean)
    .map((p) => `<p>${escapeHtml(p)}</p>`)
    .join('');

  return `
    <article class="space-y-10">
      <div class="flex items-center justify-between gap-6">
        <button
          data-action="backTutorials"
          class="px-4 py-2 glass rounded-2xl border border-white/10 hover:bg-white/5 transition-all font-bold"
        >
          ← Tutorials
        </button>
        <div class="text-right text-sm text-zinc-400">
          <div>${escapeHtml(tutorial.date || '')}</div>
          <div class="mono text-red-400">${escapeHtml(tutorial.readTime || '')}</div>
        </div>
      </div>

      <header class="space-y-3 max-w-3xl">
        <h1 class="text-4xl md:text-5xl font-bold tracking-tight">${escapeHtml(tutorial.title)}</h1>
        <p class="text-zinc-400 text-lg">${escapeHtml(tutorial.excerpt || '')}</p>
      </header>

      <div class="space-y-6 text-zinc-300 leading-relaxed text-lg">
        ${paragraphs}
      </div>
    </article>
  `;
}

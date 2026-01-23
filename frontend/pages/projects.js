// ========================================
// pages/projects.js
// Liste des projets et page de détail d'un projet
// ========================================

import { escapeHtml, icon } from '../utils/helpers.js';
import { renderMaizeAnalyzerSection } from '../utils/maize-analyzer.js';

export function renderProjects() {
  const PROJECTS = window.APP_DATA.PROJECTS;
  
  const cards = PROJECTS.map((project) => {
    const span = project.isHero ? 'md:col-span-2' : '';
    const aspect = project.isHero ? 'aspect-[21/9]' : 'aspect-video';
    return `
      <div
        class="group relative glass rounded-3xl overflow-hidden cursor-pointer transition-all duration-300
               hover:border-red-500/50 hover:shadow-2xl hover:shadow-red-500/10 ${span}"
        data-action="gotoProject:${escapeHtml(project.id)}"
      >
        <div class="relative ${aspect} overflow-hidden">
          <img
            src="${escapeHtml(project.image)}"
            alt="${escapeHtml(project.title)}"
            class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
          <div class="absolute inset-0 bg-zinc-950/40 group-hover:bg-zinc-950/20 transition-colors"></div>
        </div>
        <div class="p-8 space-y-4">
          <div class="flex items-center justify-between">
            <span class="text-xs font-mono font-bold tracking-widest text-red-400 uppercase">${escapeHtml(project.category)}</span>
            ${project.isHero ? '<span class="px-2 py-1 bg-red-500/10 text-red-400 text-[10px] font-black uppercase rounded">Top Project</span>' : ''}
          </div>
          <h3 class="text-2xl font-bold text-white">${escapeHtml(project.title)}</h3>
          <p class="text-zinc-400 line-clamp-2">${escapeHtml(project.shortDescription)}</p>
          <div class="pt-4 flex items-center text-sm font-bold text-red-400 group-hover:translate-x-1 transition-transform">
            Read full case study ${icon('chevron-right', 'w-[18px] h-[18px]')}
          </div>
        </div>
      </div>
    `;
  }).join('');

  return `
    <div class="space-y-12">
      <div class="space-y-4 max-w-2xl">
        <h1 class="text-4xl font-bold tracking-tight">Technical Case Studies</h1>
        <p class="text-zinc-400 text-lg">
          A selection of projects demonstrating full-stack AI and hardware integration capability.
        </p>
      </div>
      <div class="grid md:grid-cols-2 gap-8">
        ${cards}
      </div>
    </div>
  `;
}

export function renderProjectPage(project) {
  const features = (project.features || [])
    .map(
      (feat) => `
        <li class="flex items-start gap-3 text-zinc-300">
          ${icon('check-circle-2', 'w-[18px] h-[18px] text-red-500 shrink-0 mt-0.5')}
          <span class="text-sm">${escapeHtml(feat)}</span>
        </li>
      `
    )
    .join('');

  const challenges = (project.challenges || [])
    .map(
      (chall) => `
        <li class="flex items-start gap-3 text-zinc-400 italic">
          <span class="w-1.5 h-1.5 rounded-full bg-zinc-700 shrink-0 mt-2"></span>
          <span class="text-sm">${escapeHtml(chall)}</span>
        </li>
      `
    )
    .join('');

  const isMaize = project.id === 'maize-analyzer';

  const pipeline = isMaize
    ? `
      <div class="pt-10 border-t border-zinc-800">
        <h3 class="text-xs uppercase tracking-widest text-zinc-500 font-bold mb-6">Pipeline Architecture</h3>
        <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
          ${[
            { step: '01', title: 'Image Stream', desc: 'Camera Input' },
            { step: '02', title: 'Detection', desc: 'YOLO11 Inference' },
            { step: '03', title: 'Classification', desc: 'MobileNetV3' },
            { step: '04', title: 'Command', desc: 'JSON Output' },
          ]
            .map(
              (p) => `
              <div class="p-4 glass rounded-xl border-l-2 border-red-500">
                <div class="text-xs font-mono text-red-500 mb-1">${p.step}</div>
                <div class="text-sm font-bold text-white mb-1">${p.title}</div>
                <div class="text-[10px] text-zinc-500 uppercase">${p.desc}</div>
              </div>
            `
            )
            .join('')}
        </div>
      </div>
    `
    : '';

  const analyzer = isMaize ? renderMaizeAnalyzerSection() : '';
  const launchAction = isMaize ? 'scrollMaizeAnalyzer' : 'noop';

  return `
    <div class="space-y-12">
      <div class="flex items-center justify-between gap-6">
        <button
          data-action="backProjects"
          class="px-4 py-2 glass rounded-2xl border border-white/10 hover:bg-white/5 transition-all font-bold"
        >
          ← Projects
        </button>

        <div class="flex items-center gap-3">
          <span class="text-xs font-mono font-bold tracking-widest text-red-400 uppercase">${escapeHtml(project.category)}</span>
          ${project.isHero ? '<span class="px-2 py-1 bg-red-500/10 text-red-400 text-[10px] font-black uppercase rounded">Top Project</span>' : ''}
        </div>
      </div>

      <div class="space-y-3 max-w-3xl">
        <h1 class="text-4xl md:text-5xl font-bold tracking-tight">${escapeHtml(project.title)}</h1>
        <p class="text-zinc-400 text-lg">${escapeHtml(project.shortDescription || '')}</p>
      </div>

      <div class="grid md:grid-cols-3 gap-8">
        <div class="md:col-span-2 space-y-6">
          <section>
            <h4 class="text-xs uppercase tracking-widest text-zinc-500 font-bold mb-3">Overview</h4>
            <p class="text-xl text-white leading-relaxed font-light">${escapeHtml(project.fullDescription || '')}</p>
          </section>

          <section class="grid sm:grid-cols-2 gap-8">
            <div class="space-y-4">
              <h4 class="text-xs uppercase tracking-widest text-zinc-500 font-bold">Key Features</h4>
              <ul class="space-y-3">${features}</ul>
            </div>
            <div class="space-y-4">
              <h4 class="text-xs uppercase tracking-widest text-zinc-500 font-bold">Solved Challenges</h4>
              <ul class="space-y-3">${challenges}</ul>
            </div>
          </section>
        </div>

        <div class="space-y-6">
          <div class="p-6 glass rounded-2xl bg-white/5 border-white/10 space-y-4">
            <h4 class="text-xs uppercase tracking-widest text-zinc-500 font-bold">Try it</h4>
            <p class="text-sm text-zinc-400">
              ${isMaize ? 'Run the analyzer below.' : 'Demo coming soon.'}
            </p>
            <button
              data-action="${launchAction}"
              class="w-full py-3 bg-white text-black font-bold rounded-xl flex items-center justify-center gap-2 hover:bg-red-500 hover:text-white transition-all"
            >
              ${icon('play', 'w-4 h-4')}
              Launch Analyzer
            </button>
          </div>

          <div class="aspect-square rounded-2xl overflow-hidden glass">
            <img src="${escapeHtml(project.image)}" class="w-full h-full object-cover opacity-50 grayscale hover:grayscale-0 transition-all cursor-crosshair" alt="${escapeHtml(project.title)}" />
          </div>
        </div>
      </div>

      ${pipeline}
      ${analyzer}
    </div>
  `;
}

// ========================================
// pages/home.js
// Page d'accueil avec hero section et services
// ========================================

import { escapeHtml, icon } from '../utils/helpers.js';

export function renderHome() {
  const PROJECTS = window.APP_DATA.PROJECTS;
  const heroProject = PROJECTS.find((p) => p.isHero);

  return `
    <div class="space-y-16 lg:space-y-24">
      <section class="relative overflow-hidden">
        <div class="relative z-10 space-y-8">
          <div class="inline-flex items-center gap-2 px-3 py-1 glass rounded-full text-red-400 text-xs font-bold tracking-widest uppercase">
            ${icon('zap', 'w-3.5 h-3.5')}
            <span>Available for high-stakes projects</span>
          </div>
          <h1 class="text-5xl lg:text-7xl font-bold leading-tight tracking-tight">
            I build <span class="text-zinc-500">end-to-end</span> <br />
            AI <span class="text-red-500">&amp;</span> Robotics Systems.
          </h1>
          <p class="max-w-2xl text-xl text-zinc-400 font-light leading-relaxed">
            Bridging the gap between research and reality. From computer vision models to custom hardware interfaces and scalable backends.
          </p>
          <div class="flex flex-wrap gap-4 pt-4">
            <button
              data-action="nav:projects"
              class="px-8 py-4 bg-white text-black font-bold rounded-2xl hover:bg-red-500 hover:text-white transition-all flex items-center gap-2 group"
            >
              View Work
              ${icon('arrow-right', 'w-5 h-5 group-hover:translate-x-1 transition-transform')}
            </button>
            <button
              data-action="nav:about"
              class="px-8 py-4 glass text-white font-bold rounded-2xl hover:bg-white/10 transition-all"
            >
              About me
            </button>
          </div>
        </div>
      </section>

      <section class="grid md:grid-cols-3 gap-8">
        <div class="p-8 glass rounded-3xl space-y-4 hover:border-red-500/30 transition-colors">
          <div class="w-12 h-12 bg-red-500/10 rounded-2xl flex items-center justify-center text-red-400">
            ${icon('cpu', 'w-7 h-7')}
          </div>
          <h3 class="text-xl font-bold">Model Engineering</h3>
          <p class="text-zinc-400 text-sm leading-relaxed">Training and optimizing deep learning models for deployment on edge devices and production servers.</p>
        </div>
        <div class="p-8 glass rounded-3xl space-y-4 hover:border-red-500/30 transition-colors">
          <div class="w-12 h-12 bg-red-500/10 rounded-2xl flex items-center justify-center text-red-400">
            ${icon('bot', 'w-7 h-7')}
          </div>
          <h3 class="text-xl font-bold">Robotic Control</h3>
          <p class="text-zinc-400 text-sm leading-relaxed">Designing precision control systems, kinematics, and sensor fusion for autonomous hardware.</p>
        </div>
        <div class="p-8 glass rounded-3xl space-y-4 hover:border-red-500/30 transition-colors">
          <div class="w-12 h-12 bg-red-500/10 rounded-2xl flex items-center justify-center text-red-400">
            ${icon('code', 'w-7 h-7')}
          </div>
          <h3 class="text-xl font-bold">Software Infrastructure</h3>
          <p class="text-zinc-400 text-sm leading-relaxed">Architecting robust backends and modern web interfaces to make technical data accessible.</p>
        </div>
      </section>

      ${heroProject ? renderFeaturedProject(heroProject) : ''}
    </div>
  `;
}

function renderFeaturedProject(heroProject) {
  return `
    <section class="space-y-8">
      <div class="flex items-end justify-between border-b border-zinc-800 pb-4">
        <h2 class="text-2xl font-bold">Featured Showcase</h2>
        <button
          data-action="nav:projects"
          class="text-sm font-bold text-zinc-500 hover:text-red-400 transition-colors uppercase tracking-widest"
        >
          See all projects
        </button>
      </div>
      <div
        class="group relative h-[400px] rounded-3xl overflow-hidden cursor-pointer"
        data-action="nav:projects"
      >
        <img
          src="${escapeHtml(heroProject.image)}"
          alt="${escapeHtml(heroProject.title)}"
          class="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
        />
        <div class="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent"></div>
        <div class="absolute bottom-0 left-0 p-8 sm:p-12 space-y-2">
          <span class="text-red-400 font-mono text-sm tracking-tighter uppercase">${escapeHtml(heroProject.category)}</span>
          <h3 class="text-3xl sm:text-4xl font-bold text-white">${escapeHtml(heroProject.title)}</h3>
          <p class="max-w-lg text-zinc-300 text-lg line-clamp-2">${escapeHtml(heroProject.shortDescription)}</p>
        </div>
      </div>
    </section>
  `;
}

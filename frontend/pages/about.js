// ========================================
// pages/about.js
// ========================================
import { escapeHtml, icon } from '../utils/helpers.js';

export function renderAbout() {
  const TIMELINE = window.APP_DATA.TIMELINE;
  
  const timelineItems = TIMELINE.map(
    (item, i) => `
      <div class="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group">
        <div class="flex items-center justify-center w-10 h-10 rounded-full border border-zinc-700 bg-zinc-950 text-red-400 shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2">
          <div class="w-2 h-2 rounded-full bg-red-500 animate-pulse"></div>
        </div>
        <div class="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] glass p-6 rounded-3xl group-hover:border-red-500/30 transition-all">
          <div class="flex items-center justify-between space-x-2 mb-1">
            <div class="font-bold text-white text-lg">${escapeHtml(item.title)}</div>
            <time class="font-mono text-xs text-red-500 font-bold bg-red-500/10 px-2 py-1 rounded">${escapeHtml(item.year)}</time>
          </div>
          <div class="text-zinc-400 font-medium mb-2">${escapeHtml(item.company)}</div>
          <p class="text-zinc-500 text-sm leading-relaxed">${escapeHtml(item.description)}</p>
        </div>
      </div>
    `
  ).join('');

  return `
    <div class="space-y-16">
      <section class="grid lg:grid-cols-5 gap-12 items-start">
        <div class="lg:col-span-2">
          <div class="relative group">
            <div class="absolute -inset-2 bg-gradient-to-br from-red-500 to-purple-600 rounded-[40px] blur opacity-25 group-hover:opacity-40 transition duration-1000"></div>
            <div class="relative aspect-[4/5] rounded-[32px] overflow-hidden glass border-white/20">
              <img src="assets/images/tony_photo.jpg" alt="Profile" class="w-full h-full object-cover" />
              <div class="absolute bottom-6 left-6 right-6 p-6 glass rounded-2xl">
                <div class="flex justify-between items-center">
                  <div>
                    <h3 class="text-white font-bold text-lg">AI/Robotic Engineer</h3>
                  </div>
                  <div class="w-10 h-10 bg-red-500/20 rounded-lg flex items-center justify-center text-red-400">
                    ${icon('file-text', 'w-5 h-5')}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="lg:col-span-3 space-y-8">
          <div class="space-y-4">
            <h1 class="text-5xl font-bold tracking-tight">Anthony MIGAN</h1>
            <p class="text-xl text-zinc-400 leading-relaxed font-light">
              I specialize in autonomous systems where vision meets motion. My mission is to build robust, production-ready AI that performs reliably in real-world environments.
            </p>
          </div>

          <div class="grid sm:grid-cols-2 gap-6">
            <div class="p-6 glass rounded-2xl space-y-2">
              <h4 class="text-xs font-mono uppercase text-zinc-500">Primary Stack</h4>
              <p class="text-white font-medium">Python, C++, PyTorch, ROS2</p>
            </div>
            <div class="p-6 glass rounded-2xl space-y-2">
              <h4 class="text-xs font-mono uppercase text-zinc-500">Location</h4>
              <p class="text-white font-medium">Japan / Remote</p>
            </div>
          </div>

          <div class="flex flex-wrap gap-4 pt-4">
            <button class="px-6 py-3 bg-white text-black font-bold rounded-xl hover:bg-red-500 hover:text-white transition-all flex items-center gap-2" data-action="noop">
              ${icon('download', 'w-[18px] h-[18px]')} Download CV
            </button>
            <div class="flex gap-2">
              <a href="#" class="p-3 glass rounded-xl hover:text-red-400 transition-all" data-action="noop">${icon('linkedin', 'w-5 h-5')}</a>
              <a href="#" class="p-3 glass rounded-xl hover:text-red-400 transition-all" data-action="noop">${icon('github', 'w-5 h-5')}</a>
            </div>
          </div>
        </div>
      </section>

      <section class="space-y-12">
        <h2 class="text-3xl font-bold border-b border-zinc-800 pb-4">Career Timeline</h2>
        <div class="relative space-y-8 before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-zinc-800 before:to-transparent">
          ${timelineItems}
        </div>
      </section>
    </div>
  `;
}

//rounded-xl object-contain bg-white/5 border border-white/10
import { icon } from '../utils/helpers.js';

export function renderSidebar(state) {
  const PageType = {
    HOME: 'home',
    PROJECTS: 'projects',
    TUTORIALS: 'tutorials',
    ABOUT: 'about',
  };

  const navItems = [
    { id: PageType.HOME, label: 'Home', icon: 'home' },
    { id: PageType.PROJECTS, label: 'Projects', icon: 'briefcase' },
    { id: PageType.TUTORIALS, label: 'Tutorials', icon: 'book-open' },
    { id: PageType.ABOUT, label: 'About', icon: 'user' },
  ];

  const navHtml = navItems
    .map((item) => {
      const active = state.activePage === item.id;
      const btnCls = active
        ? 'bg-zinc-900 text-white border-l-2 border-red-500 shadow-lg'
        : 'text-zinc-400 hover:text-white hover:bg-zinc-900/50';
      const iconCls = active ? 'text-red-400' : 'text-zinc-500';

      return `
        <li>
          <button
            data-action="nav:${item.id}"
            class="w-full flex items-center gap-4 px-4 py-3 rounded-xl transition-all duration-200 ${btnCls}"
          >
            <span class="${iconCls}">${icon(item.icon, 'w-5 h-5')}</span>
            <span class="font-medium">${item.label}</span>
          </button>
        </li>
      `;
    })
    .join('');

  const isOpen = state.isSidebarOpen;
  const asideCls = `fixed inset-y-0 left-0 z-40 w-72 bg-zinc-950 border-r border-zinc-800 transition-transform duration-300 ${
    isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
  }`;

  const mobileToggleIcon = isOpen ? 'x' : 'menu';

  return `
    <button
      class="lg:hidden fixed top-6 right-6 z-50 p-2 glass rounded-lg text-white"
      data-action="toggleSidebar"
      aria-label="Toggle sidebar"
    >
      ${icon(mobileToggleIcon, 'w-6 h-6')}
    </button>

    ${isOpen ? `<div class="lg:hidden fixed inset-0 bg-black/60 z-40 backdrop-blur-sm" data-action="closeSidebar"></div>` : ''}

    <aside class="${asideCls}">
      <div class="flex flex-col h-full sidebar-scroll overflow-y-auto">
        <div class="p-8 pb-4">
          <div class="flex items-center gap-3 mb-2">
            <img
              src="./assets/images/logo.png"
              alt="Neo Oracle Robotics logo"
              class="w-20 h-20 " 
            />
            <h1 class="text-xl font-bold tracking-tight text-white leading-tight">
              <span class="text-red-500">NEO ORACLE ROBOTICS</span>
            </h1>
          </div>
          <p class="text-xs uppercase tracking-widest text-zinc-500 font-semibold">Robotics &amp; AI Lab</p>
        </div>

        <nav class="flex-1 px-4 py-8">
          <ul class="space-y-2">${navHtml}</ul>
        </nav>

        <div class="p-8 border-t border-zinc-900">
          <h3 class="text-xs uppercase tracking-widest text-zinc-500 font-bold mb-4">Get in Touch</h3>
          <div class="space-y-4">
            <a href="mailto:d2523001@s.konan-u.ac.jp" class="flex items-center gap-3 text-sm text-zinc-400 hover:text-white transition-colors group">
              ${icon('mail', 'w-4 h-4 text-zinc-600 group-hover:text-red-400')}
              <span>d2523001@s.konan-u.ac.jp</span>
            </a>
            <div class="flex gap-4 pt-2">
              <a href="#" class="p-2 glass rounded-lg text-zinc-400 hover:text-white hover:text-red-400 transition-all" data-action="noop">${icon('linkedin', 'w-5 h-5')}</a>
              <a href="#" class="p-2 glass rounded-lg text-zinc-400 hover:text-white hover:text-red-400 transition-all" data-action="noop">${icon('github', 'w-5 h-5')}</a>
            </div>
          </div>
        </div>
      </div>
    </aside>
  `;
}

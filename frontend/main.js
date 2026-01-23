/*
  Neo Oracle Robotics – Main Entry Point
  Architecture modulaire avec chargement dynamique des composants
  ⚠️ Nécessite un serveur local pour les modules ES6
*/

// ---------- Import des modules ----------
import { PROJECTS } from './data/projects/index.js';
import { TUTORIALS } from './data/tutorials/index.js';
import { TIMELINE } from './data/timeline.js';
import { renderSidebar } from './components/sidebar.js';
import { renderContactModule, renderCopyright } from './components/footer.js';
import { 
  renderHome, 
  renderProjects, 
  renderProjectPage, 
  renderTutorials, 
  renderTutorialPage, 
  renderAbout,
  renderNotFound 
} from './pages/index.js';
import { maizeFetchHealth, maizeAnalyze } from './utils/maize-analyzer.js';

// ---------- State ----------
const PageType = {
  HOME: 'home',
  PROJECTS: 'projects',
  TUTORIALS: 'tutorials',
  ABOUT: 'about',
};

const state = {
  activePage: PageType.HOME,
  activeProjectId: null,
  activeTutorialId: null,
  isSidebarOpen: false,
  _lastRouteKey: '',
};

// Exposer les données globalement pour les autres modules
window.APP_DATA = { PROJECTS, TUTORIALS, TIMELINE };
window.APP_STATE = state;

// ---------- Hash routing ----------
function parseHash() {
  const raw = (location.hash || '').replace(/^#\/?/, '').trim();
  if (!raw) return { page: PageType.HOME, id: null };

  const parts = raw.split('/').filter(Boolean);
  const head = parts[0];

  if (head === PageType.HOME) return { page: PageType.HOME, id: null };
  if (head === PageType.ABOUT) return { page: PageType.ABOUT, id: null };
  if (head === PageType.PROJECTS) return { page: PageType.PROJECTS, id: parts[1] || null };
  if (head === PageType.TUTORIALS) return { page: PageType.TUTORIALS, id: parts[1] || null };

  return { page: PageType.HOME, id: null };
}

function setHash(page, id = null) {
  const base = `#/${page}`;
  location.hash = id ? `${base}/${id}` : base;
}

function applyRouteFromHash() {
  const r = parseHash();
  setState({
    activePage: r.page,
    activeProjectId: r.page === PageType.PROJECTS ? r.id : null,
    activeTutorialId: r.page === PageType.TUTORIALS ? r.id : null,
    isSidebarOpen: false,
  });
}

// ---------- State management ----------
function setState(patch) {
  Object.assign(state, patch);
  render();
}

// Exposer setState globalement
window.setState = setState;

// ---------- Page rendering ----------
function renderPage() {
  // Project detail pages
  if (state.activePage === PageType.PROJECTS && state.activeProjectId) {
    const project = PROJECTS.find((p) => p.id === state.activeProjectId);
    return project ? renderProjectPage(project) : renderNotFound('Project not found', 'backProjects');
  }

  // Tutorial detail pages
  if (state.activePage === PageType.TUTORIALS && state.activeTutorialId) {
    const tutorial = TUTORIALS.find((t) => t.id === state.activeTutorialId);
    return tutorial ? renderTutorialPage(tutorial) : renderNotFound('Tutorial not found', 'backTutorials');
  }

  // List / static pages
  switch (state.activePage) {
    case PageType.HOME:
      return renderHome();
    case PageType.PROJECTS:
      return renderProjects();
    case PageType.TUTORIALS:
      return renderTutorials();
    case PageType.ABOUT:
      return renderAbout();
    default:
      return renderHome();
  }
}

// ---------- Main render ----------
function render() {
  const root = document.getElementById('root');
  if (!root) return;

  // Scroll to top on route change
  const routeKey = `${state.activePage}:${state.activeProjectId || state.activeTutorialId || ''}`;
  if (state._lastRouteKey !== routeKey) {
    state._lastRouteKey = routeKey;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  const pageHtml = renderPage();
  const contactHtml = state.activePage === PageType.ABOUT ? renderContactModule() : '';
  const copyrightHtml = renderCopyright();

  root.innerHTML = `
    <div class="min-h-screen bg-zinc-950 selection:bg-red-500/30">
      ${renderSidebar(state)}

      <main class="lg:ml-72 min-h-screen transition-all duration-300">
        <div class="max-w-6xl mx-auto px-6 py-12 lg:px-12 lg:py-24">
          <div class="animate-in fade-in slide-in-from-bottom-4 duration-700 fill-mode-both" id="page">
            ${pageHtml}
          </div>

          ${contactHtml}
          ${copyrightHtml}
        </div>
      </main>
    </div>
  `;

  // Render lucide icons
  if (window.lucide && typeof window.lucide.createIcons === 'function') {
    window.lucide.createIcons();
  }

  // If the Maize Analyzer section is present, ping /health
  if (document.getElementById('maize-analyzer-anchor')) {
    maizeFetchHealth();
  }

  bindEvents();
}

// ---------- Event handling ----------
function bindEvents() {
  const root = document.getElementById('root');
  if (!root) return;

  root.onclick = (ev) => {
    const el = ev.target.closest('[data-action]');
    if (!el) return;

    const action = el.getAttribute('data-action') || '';

    if (el.tagName === 'A' && el.getAttribute('href') === '#') {
      ev.preventDefault();
    }

    if (action === 'toggleSidebar') {
      setState({ isSidebarOpen: !state.isSidebarOpen });
      return;
    }

    if (action === 'closeSidebar') {
      setState({ isSidebarOpen: false });
      return;
    }

    if (action.startsWith('nav:')) {
      const page = action.split(':')[1];
      setHash(page);
      return;
    }

    if (action.startsWith('gotoProject:')) {
      const id = action.split(':')[1];
      setHash(PageType.PROJECTS, id);
      return;
    }

    if (action.startsWith('gotoTutorial:')) {
      const id = action.split(':')[1];
      setHash(PageType.TUTORIALS, id);
      return;
    }

    if (action === 'backProjects') {
      setHash(PageType.PROJECTS);
      return;
    }

    if (action === 'backTutorials') {
      setHash(PageType.TUTORIALS);
      return;
    }

    if (action === 'scrollMaizeAnalyzer') {
      const el = document.getElementById('maize-analyzer-anchor');
      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      return;
    }

    if (action === 'maizeAnalyze') {
      maizeAnalyze();
      return;
    }

    if (action === 'noop') {
      ev.preventDefault();
      return;
    }
  };

  const form = root.querySelector('form[data-action="contactSubmit"]');
  if (form) {
    form.addEventListener('submit', (e) => e.preventDefault());
  }
}

// ---------- Boot ----------
if (!location.hash) {
  setHash(PageType.HOME);
}

window.addEventListener('hashchange', applyRouteFromHash);
applyRouteFromHash();

// Exposer les fonctions de navigation globalement
window.setHash = setHash;
window.PageType = PageType;

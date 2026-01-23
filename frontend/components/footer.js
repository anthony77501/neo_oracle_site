import { icon } from '../utils/helpers.js';

export function renderContactModule() {
  return `
    <footer class="mt-24 pt-24 border-t border-zinc-900 grid md:grid-cols-2 gap-16">
      <div class="space-y-6">
        <div class="flex items-center gap-2 text-red-500 font-bold tracking-tighter uppercase text-sm">
          ${icon('terminal', 'w-[18px] h-[18px]')}
          <span>Contact Module</span>
        </div>
        <h2 class="text-3xl font-bold text-white">Let's discuss about your project.</h2>
        <p class="text-zinc-500 text-lg">
          Currently open to select freelance opportunities and full-time engineering roles in AI, robotics, or computer vision.
        </p>
      </div>

      <form class="space-y-4" data-action="contactSubmit">
        <div class="grid sm:grid-cols-2 gap-4">
          <input
            type="text"
            placeholder="Full Name"
            class="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-red-500 transition-colors"
          />
          <input
            type="email"
            placeholder="Email Address"
            class="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-red-500 transition-colors"
          />
        </div>
        <textarea
          placeholder="Project Brief / Message"
          rows="4"
          class="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-red-500 transition-colors resize-none"
        ></textarea>
        <button
          type="submit"
          class="w-full py-4 bg-white text-black font-bold rounded-xl flex items-center justify-center gap-2 hover:bg-red-500 hover:text-white transition-all group"
        >
          Send Message
          ${icon('send', 'w-[18px] h-[18px] group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform')}
        </button>
      </form>
    </footer>
  `;
}

export function renderCopyright() {
  const year = new Date().getFullYear();
  return `
    <div class="mt-24 text-center">
      <p class="text-xs font-mono text-zinc-700 tracking-widest uppercase">
        © ${year} Neo Oracle Robotics – Built for the Future
      </p>
    </div>
  `;
}

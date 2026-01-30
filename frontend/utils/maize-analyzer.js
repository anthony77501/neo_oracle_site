// ========================================
// utils/maize-analyzer.js
// ========================================
export function getMaizeApiBase() {
  // 1) Priorité: query string ?maize_api=...
  const qs = new URLSearchParams(window.location.search);
  const qp = qs.get('maize_api');
  if (qp && qp.trim()) return qp.trim().replace(/\/+$/, '');

  // 2) Priorité: localStorage
  const stored = localStorage.getItem('maize_api_base');
  if (stored && stored.trim()) return stored.trim().replace(/\/+$/, '');

  // 3) Par défaut:
  // - En local (frontend servi sur localhost), on pointe vers le backend local.
  // - En production (domaine), on utilise la même origine (pas de Cross-Origin Resource Sharing).
  const host = window.location.hostname;
  if (host === 'localhost' || host === '127.0.0.1') return 'http://127.0.0.1:8000';

  return ''; // => fetch("/predict") et fetch("/health")
}




export function renderMaizeAnalyzerSection() {
  return `
    <section id="maize-analyzer-anchor" class="pt-10 border-t border-zinc-800 space-y-8">
      <div class="flex items-start justify-between gap-6">
        <div class="space-y-2 max-w-2xl">
          <h2 class="text-3xl font-bold tracking-tight">Maize Cob Analyzer</h2>
          <p class="text-zinc-400 text-lg">Detection and maturity classification (ripe / unripe)</p>
        </div>

        <div class="text-right">
          <a id="maize-health-link" href="#" target="_blank" rel="noreferrer" class="text-sm text-zinc-300 underline decoration-white/20 hover:decoration-white/60">
            Model status
          </a>
          <div class="mt-1 text-xs text-zinc-500">
            <span id="maize-health-status">Unknown</span>
          </div>
        </div>
      </div>

      <div class="grid gap-6 lg:grid-cols-2">
        <!-- Left: Input -->
        <section class="glass rounded-3xl border border-white/10 p-6 space-y-6">
          <div class="space-y-1">
            <h3 class="text-base font-semibold">Upload an image</h3>
            <p class="text-sm text-zinc-400">
              Upload a field photo. The system will detect each maize cob and estimate its maturity.
            </p>
          </div>

          <div class="space-y-4">
            <label class="block">
              <div class="text-sm text-zinc-300">Image file (JPG/PNG)</div>
              <input
                id="maize-file"
                type="file"
                accept="image/*"
                class="mt-2 block w-full cursor-pointer rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-zinc-200"
              />
            </label>

            <div class="grid gap-4 sm:grid-cols-3">
              <label class="block">
                <div class="text-sm text-zinc-300">Detection confidence threshold</div>
                <input
                  id="maize-det"
                  type="number"
                  step="0.01"
                  min="0"
                  max="1"
                  value="0.20"
                  class="mt-2 w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-zinc-200 outline-none"
                />
              </label>

              <label class="block">
                <div class="text-sm text-zinc-300">Overlap suppression threshold</div>
                <input
                  id="maize-iou"
                  type="number"
                  step="0.01"
                  min="0"
                  max="1"
                  value="0.30"
                  class="mt-2 w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-zinc-200 outline-none"
                />
              </label>

              <label class="block">
                <div class="text-sm text-zinc-300">Ripeness decision threshold</div>
                <input
                  id="maize-ripe"
                  type="number"
                  step="0.01"
                  min="0"
                  max="1"
                  value="0.20"
                  class="mt-2 w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-zinc-200 outline-none"
                />
              </label>
            </div>

            <button
              data-action="maizeAnalyze"
              id="maize-analyze-btn"
              class="w-full py-3 bg-white text-black font-bold rounded-2xl hover:bg-red-500 hover:text-white transition-all disabled:opacity-60"
            >
              Analyze
            </button>

            <div id="maize-msg" class="text-sm text-zinc-300">Ready.</div>

            <div id="maize-table-wrap" class="hidden overflow-hidden rounded-2xl border border-white/10">
              <table class="w-full text-sm">
                <thead class="bg-white/5 text-zinc-200">
                  <tr>
                    <th class="px-4 py-3 text-left font-semibold">Cob #</th>
                    <th class="px-4 py-3 text-left font-semibold">Detection confidence</th>
                    <th class="px-4 py-3 text-left font-semibold">Ripeness probability</th>
                    <th class="px-4 py-3 text-left font-semibold">Maturity</th>
                  </tr>
                </thead>
                <tbody id="maize-table-body" class="divide-y divide-white/10 bg-black/10"></tbody>
              </table>
            </div>

            <div id="maize-summary" class="text-xs text-zinc-500"></div>
          </div>
        </section>

        <!-- Right: Output -->
        <section class="glass rounded-3xl border border-white/10 p-6 space-y-6">
          <div class="space-y-1">
            <h3 class="text-base font-semibold">Results</h3>
            <p class="text-sm text-zinc-400">Annotated image and table for each detected cob.</p>
          </div>

          <div class="rounded-2xl border border-white/10 bg-black/20 overflow-hidden">
            <img id="maize-annotated" src="" alt="Annotated preview" class="w-full hidden" />
            <div id="maize-empty" class="p-10 text-center text-sm text-zinc-500">No image analyzed yet.</div>
          </div>
        </section>
      </div>

      <div class="text-xs text-zinc-500">
        Tip: If you get "0 cobs detected", lower the detection confidence threshold slightly.
      </div>
    </section>
  `;
}

export async function maizeFetchHealth() {
  const statusEl = document.getElementById('maize-health-status');
  const linkEl = document.getElementById('maize-health-link');
  if (!statusEl || !linkEl) return;

  const base = getMaizeApiBase();
  linkEl.href = `${base}/health`;

  try {
    const res = await fetch(`${base}/health`);
    const j = await res.json();
    statusEl.textContent = j && j.ok ? 'Online' : 'Unknown';
  } catch (_) {
    statusEl.textContent = 'Offline / CORS blocked';
  }
}

let _maizeBusy = false;

export async function maizeAnalyze() {
  if (_maizeBusy) return;

  const base = getMaizeApiBase();
  const fileEl = document.getElementById('maize-file');
  const detEl = document.getElementById('maize-det');
  const iouEl = document.getElementById('maize-iou');
  const ripeEl = document.getElementById('maize-ripe');
  const msgEl = document.getElementById('maize-msg');
  const btnEl = document.getElementById('maize-analyze-btn');
  const imgEl = document.getElementById('maize-annotated');
  const emptyEl = document.getElementById('maize-empty');
  const tableWrap = document.getElementById('maize-table-wrap');
  const tbody = document.getElementById('maize-table-body');
  const summary = document.getElementById('maize-summary');

  if (!fileEl || !detEl || !iouEl || !ripeEl || !msgEl || !btnEl || !imgEl || !emptyEl || !tableWrap || !tbody || !summary) {
    return;
  }

  const file = fileEl.files && fileEl.files[0] ? fileEl.files[0] : null;
  if (!file) {
    msgEl.textContent = 'Please select an image first.';
    return;
  }

  _maizeBusy = true;
  btnEl.setAttribute('disabled', 'true');
  msgEl.textContent = 'Running inference...';
  summary.textContent = '';
  tbody.innerHTML = '';
  tableWrap.classList.add('hidden');
  imgEl.classList.add('hidden');
  imgEl.src = '';
  emptyEl.classList.remove('hidden');

  try {
    const fd = new FormData();
    fd.append('file', file);
    fd.append('detection_confidence_threshold', String(detEl.value || '0.2'));
    fd.append('overlap_suppression_threshold', String(iouEl.value || '0.3'));
    fd.append('ripeness_decision_threshold', String(ripeEl.value || '0.2'));

    const res = await fetch(`${base}/predict`, { method: 'POST', body: fd });
    const data = await res.json();

    if (!data || !data.ok) {
      msgEl.textContent = (data && data.error) ? data.error : 'Unknown error.';
      return;
    }

    msgEl.textContent = 'Done.';

    if (data.annotated_image_data_url) {
      imgEl.src = data.annotated_image_data_url;
      imgEl.classList.remove('hidden');
      emptyEl.classList.add('hidden');
    }

    const rows = Array.isArray(data.results) ? data.results : [];
    if (rows.length > 0) {
      tbody.innerHTML = rows
        .map((r) => {
          const cob = String(r.cob_number ?? '');
          const dc = Number(r.detection_confidence ?? 0);
          const rp = Number(r.ripeness_probability ?? 0);
          const lab = String(r.maturity_label ?? '');
          return `
            <tr>
              <td class="px-4 py-3">${cob}</td>
              <td class="px-4 py-3">${dc.toFixed(3)}</td>
              <td class="px-4 py-3">${rp.toFixed(3)}</td>
              <td class="px-4 py-3 font-bold">${lab}</td>
            </tr>
          `;
        })
        .join('');
      tableWrap.classList.remove('hidden');
    }

    const n = Number(data.cobs_detected ?? rows.length ?? 0);
    summary.textContent = `Detected ${n} maize cob(s).`;
  } catch (e) {
    msgEl.textContent = String(e);
  } finally {
    _maizeBusy = false;
    btnEl.removeAttribute('disabled');
  }
}

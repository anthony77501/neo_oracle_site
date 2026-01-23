// const form = document.getElementById("f");
// const msg = document.getElementById("msg");
// const img = document.getElementById("outimg");
// const tbl = document.getElementById("tbl");
// const tbody = tbl.querySelector("tbody");

// form.addEventListener("submit", async (e) => {
//   e.preventDefault();
//   msg.textContent = "Running...";
//   img.style.display = "none";
//   tbl.style.display = "none";
//   tbody.innerHTML = "";

//   const fd = new FormData(form);

//   const r = await fetch("/predict", { method: "POST", body: fd });
//   const j = await r.json();

//   if (!j.ok) {
//     msg.textContent = "Error: " + (j.error || "unknown");
//     return;
//   }

//   msg.textContent = `Done. Detections: ${j.detections}`;

//   if (j.detections === 0) {
//     msg.textContent += " (No ears detected. Try lowering det_conf.)";
//     return;
//   }

//   img.src = j.annotated_url;
//   img.style.display = "block";

//   for (const row of j.rows) {
//     const tr = document.createElement("tr");
//     tr.innerHTML = `<td>${row.ear_id}</td><td>${row.det_conf}</td><td>${row.ripe_prob}</td><td>${row.label}</td>`;
//     tbody.appendChild(tr);
//   }
//   tbl.style.display = "table";
// });


    const form = document.getElementById("form");
    const btn = document.getElementById("btn");
    const btnText = document.getElementById("btnText");
    const spinner = document.getElementById("spinner");
    const msg = document.getElementById("msg");
    const outimg = document.getElementById("outimg");
    const placeholder = document.getElementById("placeholder");
    const tableWrap = document.getElementById("tableWrap");
    const tbody = document.getElementById("tbody");
    const summary = document.getElementById("summary");

    function setLoading(isLoading) {
      btn.disabled = isLoading;
      spinner.classList.toggle("hidden", !isLoading);
      btnText.textContent = isLoading ? "Analyzing..." : "Analyze";
    }

    function escapeHtml(s) {
      return String(s).replace(/[&<>"']/g, m => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]));
    }

    form.addEventListener("submit", async (e) => {
      e.preventDefault();
      msg.textContent = "";
      summary.classList.add("hidden");
      tableWrap.classList.add("hidden");
      tbody.innerHTML = "";

      const fd = new FormData(form);

      setLoading(true);
      msg.textContent = "Running detection and maturity classification...";

      try {
        const res = await fetch("/predict", { method: "POST", body: fd });
        const data = await res.json();

        if (!data.ok) {
          msg.textContent = "Error: " + (data.error || "Unknown error");
          setLoading(false);
          return;
        }

        // Show annotated image (no disk)
        if (data.annotated_image_data_url) {
          outimg.src = data.annotated_image_data_url;
          outimg.classList.remove("hidden");
          placeholder.classList.add("hidden");
        }

        const results = data.results || [];
        const n = data.cobs_detected ?? results.length;

        if (n === 0) {
          msg.textContent = "No maize cobs were detected. Try lowering the detection confidence threshold.";
          summary.textContent = "Detected 0 cobs.";
          summary.classList.remove("hidden");
          setLoading(false);
          return;
        }

        // Build table
        results.forEach(r => {
          const tr = document.createElement("tr");

          const cobNumber = r.cob_number ?? "";
          const detConf = (r.detection_confidence ?? 0).toFixed(3);
          const ripeProb = (r.ripeness_probability ?? 0).toFixed(3);
          const label = escapeHtml(r.maturity_label ?? "");

          tr.innerHTML = `
            <td class="px-4 py-3">#${cobNumber}</td>
            <td class="px-4 py-3">${detConf}</td>
            <td class="px-4 py-3">${ripeProb}</td>
            <td class="px-4 py-3">
              <span class="rounded-full border border-white/10 px-3 py-1 text-xs">${label}</span>
            </td>
          `;
          tbody.appendChild(tr);
        });

        tableWrap.classList.remove("hidden");
        summary.textContent = `Detected ${n} maize cob(s).`;
        summary.classList.remove("hidden");
        msg.textContent = "Done.";

      } catch (err) {
        msg.textContent = "Error: " + err;
      } finally {
        setLoading(false);
      }
    });
  
/**
 * constant-history (CHIST) - Main Application Controller
 * Handles UI interactions, tabs, constants selection, timeline plotting,
 * time machine (as-of query), diff comparator, simulated CLI, and KaTeX rendering.
 */

document.addEventListener("DOMContentLoaded", () => {
  const corpus = CONSTANTS_CORPUS;
  let activeConstantId = "c";
  const plotter = new TimelinePlotter("plot-value-container", "plot-uncertainty-container");

  // DOM Elements
  const constantSelect = document.getElementById("constant-select");
  const tabButtons = document.querySelectorAll(".nav-tab-btn");
  const tabPanes = document.querySelectorAll(".tab-pane");

  // Info header elements
  const infoTitle = document.getElementById("info-const-name");
  const infoCategory = document.getElementById("info-const-category");
  const infoUnit = document.getElementById("info-const-unit");
  const infoStatus = document.getElementById("info-const-status");
  const infoDesc = document.getElementById("info-const-desc");
  const eventsListContainer = document.getElementById("events-list-container");

  // Time Machine elements
  const timeMachineSlider = document.getElementById("time-machine-slider");
  const timeMachineYearDisplay = document.getElementById("time-machine-year-display");
  const timeMachineTableBody = document.getElementById("time-machine-table-body");

  // Diff elements
  const diffConstSelect = document.getElementById("diff-constant-select");
  const diffYearFrom = document.getElementById("diff-year-from");
  const diffYearTo = document.getElementById("diff-year-to");
  const btnRunDiff = document.getElementById("btn-run-diff");
  const diffResultCard = document.getElementById("diff-result-card");

  // CLI elements
  const cliInput = document.getElementById("cli-input");
  const cliOutput = document.getElementById("cli-output");

  // Initialize Constant Dropdowns
  populateConstantDropdowns();
  initTabs();
  initTimeMachine();
  initDiffComparator();
  loadConstant(activeConstantId);

  // Actions
  document.getElementById("btn-print-report")?.addEventListener("click", () => {
    window.print();
  });

  document.getElementById("btn-export-json")?.addEventListener("click", () => {
    exportCorpusJson();
  });

  function populateConstantDropdowns() {
    if (constantSelect) {
      constantSelect.innerHTML = "";
      corpus.constants.forEach(c => {
        const opt = document.createElement("option");
        opt.value = c.id;
        opt.textContent = `${c.name} (${c.symbol})`;
        if (c.id === activeConstantId) opt.selected = true;
        constantSelect.appendChild(opt);
      });

      constantSelect.addEventListener("change", (e) => {
        loadConstant(e.target.value);
      });
    }

    if (diffConstSelect) {
      diffConstSelect.innerHTML = "";
      corpus.constants.forEach(c => {
        const opt = document.createElement("option");
        opt.value = c.id;
        opt.textContent = `${c.name} (${c.symbol})`;
        diffConstSelect.appendChild(opt);
      });
    }
  }

  function initTabs() {
    tabButtons.forEach(btn => {
      btn.addEventListener("click", () => {
        const targetId = btn.dataset.tab;
        tabButtons.forEach(b => b.classList.remove("active"));
        tabPanes.forEach(p => p.classList.remove("active"));

        btn.classList.add("active");
        const targetPane = document.getElementById(targetId);
        if (targetPane) {
          targetPane.classList.add("active");
          if (targetId === "tab-timeline") {
            setTimeout(() => plotter.render(activeConstantId, corpus), 50);
          } else if (targetId === "tab-timemachine") {
            updateTimeMachineView(parseInt(timeMachineSlider.value, 10));
          }
        }
      });
    });
  }

  function loadConstant(id) {
    activeConstantId = id;
    const c = corpus.constants.find(item => item.id === id);
    if (!c) return;

    if (infoTitle) infoTitle.textContent = `${c.name} (${c.symbol})`;
    if (infoCategory) infoCategory.textContent = c.category;
    if (infoUnit) infoUnit.textContent = `Unidad SI: ${c.si_unit}`;
    if (infoStatus) infoStatus.textContent = c.current_status;
    if (infoDesc) infoDesc.textContent = c.description;

    // Render Charts
    plotter.render(id, corpus);

    // Render Chronological Milestone Cards
    renderMilestones(id);

    if (window.renderMathInElement) {
      window.renderMathInElement(document.body, {
        delimiters: [
          { left: "$$", right: "$$", display: true },
          { left: "$", right: "$", display: false }
        ],
        throwOnError: false
      });
    }

    appendCliMessage(`Constante seleccionada: ${c.name} [${c.symbol}]`, "sys");
  }

  function renderMilestones(id) {
    if (!eventsListContainer) return;
    eventsListContainer.innerHTML = "";

    const events = corpus.events
      .filter(e => e.constant_id === id)
      .sort((a, b) => b.year - a.year); // most recent first

    events.forEach(e => {
      const card = document.createElement("div");
      card.className = "milestone-card";

      const isDef = e.type === "definition";
      const isRec = e.type === "recommended";
      const badgeCls = isDef ? "badge-def" : isRec ? "badge-rec" : "badge-meas";
      const badgeText = isDef ? "EXACTA POR DEFINICIÓN" : isRec ? "VALOR RECOMENDADO" : "MEDICIÓN EXPERIMENTAL";

      const valStr = Number(e.value).toExponential(8);
      const uncStr = e.uncertainty !== undefined && e.uncertainty !== null 
        ? (e.uncertainty === 0 ? "0 (Exacto)" : `± ${Number(e.uncertainty).toExponential(3)}`) 
        : "--";
      const relUncStr = e.relative_uncertainty !== undefined && e.relative_uncertainty !== null
        ? (e.relative_uncertainty === 0 ? "0" : Number(e.relative_uncertainty).toExponential(2))
        : "--";

      card.innerHTML = `
        <div class="milestone-header">
          <span class="milestone-year">${e.year}</span>
          <span class="milestone-badge ${badgeCls}">${badgeText}</span>
          <span class="milestone-authority">${e.authority}</span>
        </div>
        <div class="milestone-body">
          <div class="milestone-val-row">
            <span class="lbl">Valor Asignado:</span>
            <code class="val-mono">${e.value}</code>
          </div>
          <div class="milestone-metrics-row">
            <div><span class="lbl">Incertidumbre absoluta:</span> <code>${uncStr}</code></div>
            <div><span class="lbl">Incertidumbre relativa:</span> <code>${relUncStr}</code></div>
            ${e.method ? `<div><span class="lbl">Método:</span> <em>${e.method}</em></div>` : ""}
          </div>
          ${e.notes ? `<div class="milestone-notes"><i class="fa-solid fa-circle-info"></i> ${e.notes}</div>` : ""}
        </div>
      `;

      eventsListContainer.appendChild(card);
    });
  }

  // Time Machine (As-Of Queries)
  function initTimeMachine() {
    if (!timeMachineSlider) return;

    timeMachineSlider.addEventListener("input", (e) => {
      const yr = parseInt(e.target.value, 10);
      timeMachineYearDisplay.textContent = yr;
      updateTimeMachineView(yr);
    });

    updateTimeMachineView(parseInt(timeMachineSlider.value, 10));
  }

  function updateTimeMachineView(year) {
    if (!timeMachineTableBody) return;
    timeMachineTableBody.innerHTML = "";

    corpus.constants.forEach(c => {
      // Find the most recent recommended value or definition event on or before this year
      const events = corpus.events
        .filter(e => e.constant_id === c.id && e.year <= year && (e.type === "recommended" || e.type === "definition" || e.type === "measurement"))
        .sort((a, b) => a.year - b.year);

      const latestEvent = events.length > 0 ? events[events.length - 1] : null;

      const tr = document.createElement("tr");

      if (latestEvent) {
        const isDef = latestEvent.type === "definition";
        const isRec = latestEvent.type === "recommended";
        const tagText = isDef ? "EXACTA (Definición)" : isRec ? `CODATA (${latestEvent.year})` : `Exp. (${latestEvent.year})`;
        const tagCls = isDef ? "pill-pass" : isRec ? "pill-warn" : "pill-meas";

        const uncStr = latestEvent.uncertainty === 0 ? "0 (Exacto)" : (latestEvent.uncertainty ? `± ${Number(latestEvent.uncertainty).toExponential(3)}` : "--");
        const relUncStr = latestEvent.relative_uncertainty === 0 ? "0" : (latestEvent.relative_uncertainty ? Number(latestEvent.relative_uncertainty).toExponential(2) : "--");

        tr.innerHTML = `
          <td><strong>${c.name}</strong> (<code>${c.symbol}</code>)</td>
          <td style="font-family: var(--font-mono); font-weight: 700;">${latestEvent.value}</td>
          <td>${c.si_unit}</td>
          <td style="font-family: var(--font-mono);">${uncStr}</td>
          <td style="font-family: var(--font-mono);">${relUncStr}</td>
          <td><span class="status-pill-badge ${tagCls}">${tagText}</span></td>
          <td class="text-muted"><small>${latestEvent.authority}</small></td>
        `;
      } else {
        tr.innerHTML = `
          <td><strong>${c.name}</strong> (<code>${c.symbol}</code>)</td>
          <td colspan="6" style="color: #64748b; font-style: italic;">
            Desconocida o sin consenso metrológico en ${year}
          </td>
        `;
      }

      timeMachineTableBody.appendChild(tr);
    });
  }

  // Diff Comparator
  function initDiffComparator() {
    if (!btnRunDiff) return;

    btnRunDiff.addEventListener("click", () => {
      const cid = diffConstSelect.value;
      const yFrom = parseInt(diffYearFrom.value, 10);
      const yTo = parseInt(diffYearTo.value, 10);

      runDiffComparison(cid, yFrom, yTo);
    });
  }

  function runDiffComparison(cid, yFrom, yTo) {
    const c = corpus.constants.find(item => item.id === cid);
    if (!c || !diffResultCard) return;

    // Get as-of events
    const evFrom = getAsOfEvent(cid, yFrom);
    const evTo = getAsOfEvent(cid, yTo);

    if (!evFrom || !evTo) {
      diffResultCard.innerHTML = `<div class="diff-msg-warn">No hay datos suficientes para comparar ${cid} entre ${yFrom} y ${yTo}.</div>`;
      return;
    }

    const val1 = Number(evFrom.value);
    const val2 = Number(evTo.value);
    const deltaVal = val2 - val1;
    const deltaPct = val1 !== 0 ? (deltaVal / val1) * 100 : 0;

    const unc1 = evFrom.uncertainty !== null ? Number(evFrom.uncertainty) : null;
    const unc2 = evTo.uncertainty !== null ? Number(evTo.uncertainty) : null;

    let precisionRatioStr = "N/A";
    if (unc1 && unc2 && unc2 > 0) {
      const ratio = unc1 / unc2;
      precisionRatioStr = `${ratio.toFixed(1)}x mayor precisión`;
    } else if (unc2 === 0 && unc1 && unc1 > 0) {
      precisionRatioStr = "Incertidumbre reducida a Cero (Fijación exacta en el SI)";
    }

    diffResultCard.innerHTML = `
      <div class="diff-summary-header">
        <h3>Comparativa Histórica de ${c.name} (${c.symbol}): Año ${yFrom} vs ${yTo}</h3>
      </div>
      <div class="diff-grid">
        <div class="diff-col">
          <div class="diff-year-title">Estado en ${yFrom}</div>
          <div class="diff-metric"><span class="lbl">Valor Aceptado:</span> <code>${evFrom.value} ${c.si_unit}</code></div>
          <div class="diff-metric"><span class="lbl">Incertidumbre:</span> <code>± ${evFrom.uncertainty ?? 'N/D'}</code></div>
          <div class="diff-metric"><span class="lbl">Incertidumbre Relativa:</span> <code>${evFrom.relative_uncertainty ? Number(evFrom.relative_uncertainty).toExponential(2) : 'N/D'}</code></div>
          <div class="diff-metric"><span class="lbl">Fuente / Autoridad:</span> <em>${evFrom.authority}</em></div>
        </div>
        <div class="diff-col">
          <div class="diff-year-title">Estado en ${yTo}</div>
          <div class="diff-metric"><span class="lbl">Valor Aceptado:</span> <code>${evTo.value} ${c.si_unit}</code></div>
          <div class="diff-metric"><span class="lbl">Incertidumbre:</span> <code>± ${evTo.uncertainty ?? 'N/D'}</code></div>
          <div class="diff-metric"><span class="lbl">Incertidumbre Relativa:</span> <code>${evTo.relative_uncertainty ? Number(evTo.relative_uncertainty).toExponential(2) : 'N/D'}</code></div>
          <div class="diff-metric"><span class="lbl">Fuente / Autoridad:</span> <em>${evTo.authority}</em></div>
        </div>
      </div>
      <div class="diff-insights-box">
        <div><strong>Desplazamiento del Valor:</strong> ${deltaVal >= 0 ? '+' : ''}${deltaVal.toExponential(4)} (${deltaPct >= 0 ? '+' : ''}${deltaPct.toFixed(6)}%)</div>
        <div><strong>Evolución de Precisión:</strong> <span style="color: #10b981; font-weight: 700;">${precisionRatioStr}</span></div>
      </div>
    `;
  }

  function getAsOfEvent(cid, year) {
    const events = corpus.events
      .filter(e => e.constant_id === cid && e.year <= year && (e.type === "recommended" || e.type === "definition" || e.type === "measurement"))
      .sort((a, b) => a.year - b.year);
    return events.length > 0 ? events[events.length - 1] : null;
  }

  function exportCorpusJson() {
    const blob = new Blob([JSON.stringify(corpus, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "corpus_constantes_fisicas.json";
    a.click();
    URL.revokeObjectURL(url);
  }

  // Web CLI Simulator
  if (cliInput) {
    cliInput.addEventListener("keydown", (e) => {
      if (e.key === "Enter") {
        const cmd = cliInput.value.trim();
        cliInput.value = "";
        executeCliCommand(cmd);
      }
    });
  }

  function appendCliMessage(text, type = "normal") {
    if (!cliOutput) return;
    const line = document.createElement("div");
    line.className = `cli-line cli-${type}`;
    line.textContent = text;
    cliOutput.appendChild(line);
    cliOutput.scrollTop = cliOutput.scrollHeight;
  }

  function executeCliCommand(cmd) {
    appendCliMessage(`$ ${cmd}`, "user");
    const parts = cmd.split(" ").filter(p => p.length > 0);
    const root = parts[0]?.toLowerCase() || "";

    switch (root) {
      case "help":
        appendCliMessage("Comandos disponibles de chist CLI:", "info");
        appendCliMessage("  chist show <c|h|G|e|k|Na|alpha>             : Ver estado actual de una constante", "sys");
        appendCliMessage("  chist timeline <id>                         : Ver cronología histórica de eventos", "sys");
        appendCliMessage("  chist value <id> --year <yyyy>              : Máquina del tiempo (as-of query)", "sys");
        appendCliMessage("  chist diff <id> --from <y1> --to <y2>       : Comparativa de precisión entre épocas", "sys");
        appendCliMessage("  chist demo                                  : Demostración interactiva guiada", "sys");
        appendCliMessage("  clear                                       : Limpiar pantalla de la terminal", "sys");
        break;

      case "clear":
        cliOutput.innerHTML = "";
        break;

      case "chist":
        handleChistCommand(parts.slice(1));
        break;

      default:
        appendCliMessage(`Comando '${cmd}' no reconocido. Escribí 'help' para ver opciones.`, "error");
        break;
    }
  }

  function handleChistCommand(args) {
    const sub = args[0]?.toLowerCase();
    if (!sub || sub === "help") {
      executeCliCommand("help");
      return;
    }

    if (sub === "show") {
      const cid = args[1] || "c";
      const c = corpus.constants.find(item => item.id.toLowerCase() === cid.toLowerCase());
      if (!c) {
        appendCliMessage(`Constante '${cid}' no encontrada. Opciones: c, h, G, e, k, Na, alpha`, "error");
        return;
      }
      appendCliMessage(`--- ${c.name} (${c.symbol}) ---`, "info");
      appendCliMessage(`  Categoría:  ${c.category}`, "sys");
      appendCliMessage(`  Unidad SI:  ${c.si_unit}`, "sys");
      appendCliMessage(`  Estado:     ${c.current_status}`, "success");
      appendCliMessage(`  ${c.description}`, "sys");
    } else if (sub === "timeline") {
      const cid = args[1] || "G";
      const events = corpus.events.filter(e => e.constant_id.toLowerCase() === cid.toLowerCase());
      appendCliMessage(`--- Cronología de ${cid} (${events.length} hitos) ---`, "info");
      events.forEach(e => {
        appendCliMessage(`  ${String(e.year).padEnd(6)} [${e.type.padEnd(11)}] = ${e.value} (± ${e.uncertainty || 0}) | ${e.authority}`, "sys");
      });
    } else if (sub === "value") {
      const cid = args[1] || "c";
      let yr = 1980;
      const yrIdx = args.indexOf("--year");
      if (yrIdx >= 0 && args[yrIdx + 1]) yr = parseInt(args[yrIdx + 1], 10);

      const ev = getAsOfEvent(cid, yr);
      if (ev) {
        appendCliMessage(`Valor de ${cid} en el año ${yr}:`, "info");
        appendCliMessage(`  ${ev.value} (± ${ev.uncertainty || 0}) [${ev.type.toUpperCase()}] s/ ${ev.authority}`, "success");
      } else {
        appendCliMessage(`No hay registro aceptado para ${cid} en ${yr}`, "error");
      }
    } else if (sub === "diff") {
      const cid = args[1] || "h";
      let y1 = 1986, y2 = 2019;
      const fromIdx = args.indexOf("--from");
      if (fromIdx >= 0 && args[fromIdx + 1]) y1 = parseInt(args[fromIdx + 1], 10);
      const toIdx = args.indexOf("--to");
      if (toIdx >= 0 && args[toIdx + 1]) y2 = parseInt(args[toIdx + 1], 10);

      const ev1 = getAsOfEvent(cid, y1);
      const ev2 = getAsOfEvent(cid, y2);
      if (ev1 && ev2) {
        appendCliMessage(`Comparativa de ${cid} (${y1} vs ${y2}):`, "info");
        appendCliMessage(`  Año ${y1}: ${ev1.value} (± ${ev1.uncertainty}) s/ ${ev1.authority}`, "sys");
        appendCliMessage(`  Año ${y2}: ${ev2.value} (± ${ev2.uncertainty}) s/ ${ev2.authority}`, "sys");
        appendCliMessage(`  Delta: ${Number(ev2.value) - Number(ev1.value)}`, "success");
      }
    } else if (sub === "demo") {
      appendCliMessage("[DEMO] Mostrando la historia del valor de c y su exactificación...", "info");
      loadConstant("c");
      setTimeout(() => {
        appendCliMessage("[DEMO] Cargando el problema histórico de Big G y la crisis de CODATA 1998...", "info");
        loadConstant("G");
      }, 1500);
    } else {
      appendCliMessage(`Subcomando chist '${sub}' no reconocido.`, "error");
    }
  }

  appendCliMessage("constant-history CLI v2.0.0 iniciada. Escribí 'help' para explorar comandos.", "sys");
});

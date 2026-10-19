/**
 * constant-history (CHIST) - Interactive SVG Timeline and Uncertainty Plotter
 * High precision charting of physical constants evolution, error bars, and logarithmic precision gains.
 */

class TimelinePlotter {
  constructor(valueCanvasId, uncertaintyCanvasId) {
    this.valueContainer = typeof valueCanvasId === "string" ? document.getElementById(valueCanvasId) : valueCanvasId;
    this.uncContainer = typeof uncertaintyCanvasId === "string" ? document.getElementById(uncertaintyCanvasId) : uncertaintyCanvasId;
  }

  render(constantId, corpus) {
    const constant = corpus.constants.find(c => c.id === constantId);
    if (!constant) return;

    const events = corpus.events
      .filter(e => e.constant_id === constantId)
      .sort((a, b) => a.year - b.year);

    this.renderValuePlot(constant, events);
    this.renderUncertaintyPlot(constant, events);
  }

  renderValuePlot(constant, events) {
    if (!this.valueContainer) return;
    this.valueContainer.innerHTML = "";

    const width = 860;
    const height = 360;
    const padLeft = 90;
    const padRight = 40;
    const padTop = 40;
    const padBottom = 50;

    const years = events.map(e => e.year);
    const minYear = Math.min(...years) - 10;
    const maxYear = Math.max(...years, 2026) + 10;

    const values = events.map(e => e.value);
    const minVal = Math.min(...values);
    const maxVal = Math.max(...values);
    const valRange = maxVal - minVal || Math.abs(maxVal * 0.1) || 1;
    const plotMinVal = minVal - valRange * 0.15;
    const plotMaxVal = maxVal + valRange * 0.15;

    const scaleX = y => padLeft + ((y - minYear) / (maxYear - minYear)) * (width - padLeft - padRight);
    const scaleY = v => height - padBottom - ((v - plotMinVal) / (plotMaxVal - plotMinVal)) * (height - padTop - padBottom);

    const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    svg.setAttribute("viewBox", `0 0 ${width} ${height}`);
    svg.setAttribute("class", "chist-plot-svg");
    svg.style.width = "100%";
    svg.style.height = "100%";

    // Grid lines & Axis labels
    const gridG = document.createElementNS("http://www.w3.org/2000/svg", "g");

    // X axis ticks
    const yearStep = Math.max(20, Math.round((maxYear - minYear) / 6 / 10) * 10);
    const startTickYear = Math.ceil(minYear / yearStep) * yearStep;

    for (let yr = startTickYear; yr <= maxYear; yr += yearStep) {
      const x = scaleX(yr);
      const line = document.createElementNS("http://www.w3.org/2000/svg", "line");
      line.setAttribute("x1", x);
      line.setAttribute("y1", padTop);
      line.setAttribute("x2", x);
      line.setAttribute("y2", height - padBottom);
      line.setAttribute("stroke", "rgba(255, 255, 255, 0.06)");
      gridG.appendChild(line);

      const label = document.createElementNS("http://www.w3.org/2000/svg", "text");
      label.setAttribute("x", x);
      label.setAttribute("y", height - padBottom + 20);
      label.setAttribute("fill", "#64748b");
      label.setAttribute("font-size", "11px");
      label.setAttribute("font-family", "var(--font-mono)");
      label.setAttribute("text-anchor", "middle");
      label.textContent = yr;
      gridG.appendChild(label);
    }

    // Y axis ticks (5 ticks)
    for (let i = 0; i <= 4; i++) {
      const val = plotMinVal + (i / 4) * (plotMaxVal - plotMinVal);
      const y = scaleY(val);

      const line = document.createElementNS("http://www.w3.org/2000/svg", "line");
      line.setAttribute("x1", padLeft);
      line.setAttribute("y1", y);
      line.setAttribute("x2", width - padRight);
      line.setAttribute("y2", y);
      line.setAttribute("stroke", "rgba(255, 255, 255, 0.06)");
      gridG.appendChild(line);

      const label = document.createElementNS("http://www.w3.org/2000/svg", "text");
      label.setAttribute("x", padLeft - 10);
      label.setAttribute("y", y + 4);
      label.setAttribute("fill", "#64748b");
      label.setAttribute("font-size", "10px");
      label.setAttribute("font-family", "var(--font-mono)");
      label.setAttribute("text-anchor", "end");
      label.textContent = val.toExponential(3);
      gridG.appendChild(label);
    }
    svg.appendChild(gridG);

    // Trend path
    let pathD = "";
    events.forEach((e, idx) => {
      const x = scaleX(e.year);
      const y = scaleY(e.value);
      pathD += (idx === 0 ? "M " : " L ") + `${x} ${y}`;
    });

    const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
    path.setAttribute("d", pathD);
    path.setAttribute("fill", "none");
    path.setAttribute("stroke", "rgba(0, 229, 255, 0.4)");
    path.setAttribute("stroke-width", "1.5");
    path.setAttribute("stroke-dasharray", "4, 3");
    svg.appendChild(path);

    // Error bars & Event Markers
    const markersG = document.createElementNS("http://www.w3.org/2000/svg", "g");

    events.forEach(e => {
      const x = scaleX(e.year);
      const y = scaleY(e.value);

      // Error Bar
      if (e.uncertainty && e.uncertainty > 0) {
        const yTop = scaleY(e.value + e.uncertainty);
        const yBottom = scaleY(e.value - e.uncertainty);

        const errLine = document.createElementNS("http://www.w3.org/2000/svg", "line");
        errLine.setAttribute("x1", x);
        errLine.setAttribute("y1", yTop);
        errLine.setAttribute("x2", x);
        errLine.setAttribute("y2", yBottom);
        errLine.setAttribute("stroke", "#f59e0b");
        errLine.setAttribute("stroke-width", "1.75");
        markersG.appendChild(errLine);

        // Caps
        [-4, 4].forEach(dx => {
          const capTop = document.createElementNS("http://www.w3.org/2000/svg", "line");
          capTop.setAttribute("x1", x - 4);
          capTop.setAttribute("y1", yTop);
          capTop.setAttribute("x2", x + 4);
          capTop.setAttribute("y2", yTop);
          capTop.setAttribute("stroke", "#f59e0b");
          capTop.setAttribute("stroke-width", "1.5");
          markersG.appendChild(capTop);

          const capBottom = document.createElementNS("http://www.w3.org/2000/svg", "line");
          capBottom.setAttribute("x1", x - 4);
          capBottom.setAttribute("y1", yBottom);
          capBottom.setAttribute("x2", x + 4);
          capBottom.setAttribute("y2", yBottom);
          capBottom.setAttribute("stroke", "#f59e0b");
          capBottom.setAttribute("stroke-width", "1.5");
          markersG.appendChild(capBottom);
        });
      }

      // Point Marker
      const circle = document.createElementNS("http://www.w3.org/2000/svg", "circle");
      circle.setAttribute("cx", x);
      circle.setAttribute("cy", y);
      circle.setAttribute("r", e.type === "definition" ? "7" : "5.5");

      const markerColor = e.type === "definition" ? "#10b981" : e.type === "recommended" ? "#f59e0b" : "#00e5ff";
      circle.setAttribute("fill", markerColor);
      circle.setAttribute("stroke", "#070b14");
      circle.setAttribute("stroke-width", "2");
      circle.style.cursor = "pointer";

      // Hover title tooltip
      const titleEl = document.createElementNS("http://www.w3.org/2000/svg", "title");
      titleEl.textContent = `${e.year}: ${e.authority}\nValor: ${e.value} ${constant.si_unit}\nIncertidumbre: ±${e.uncertainty || 0}\nTipo: ${e.type.toUpperCase()}`;
      circle.appendChild(titleEl);

      markersG.appendChild(circle);
    });

    svg.appendChild(markersG);

    // Title & Axis names
    const yAxisName = document.createElementNS("http://www.w3.org/2000/svg", "text");
    yAxisName.setAttribute("x", 20);
    yAxisName.setAttribute("y", padTop - 15);
    yAxisName.setAttribute("fill", "#94a3b8");
    yAxisName.setAttribute("font-size", "11px");
    yAxisName.setAttribute("font-weight", "700");
    yAxisName.textContent = `Valor de ${constant.symbol} [${constant.si_unit}]`;
    svg.appendChild(yAxisName);

    this.valueContainer.appendChild(svg);
  }

  renderUncertaintyPlot(constant, events) {
    if (!this.uncContainer) return;
    this.uncContainer.innerHTML = "";

    const width = 860;
    const height = 280;
    const padLeft = 80;
    const padRight = 40;
    const padTop = 30;
    const padBottom = 45;

    // Filter events with relative uncertainty > 0
    const validEvents = events.filter(e => e.relative_uncertainty !== undefined && e.relative_uncertainty !== null && e.relative_uncertainty > 0);

    if (validEvents.length === 0) {
      this.uncContainer.innerHTML = `<div style="padding: 2rem; text-align: center; color: #94a3b8;">No se registran mediciones con incertidumbre relativa para esta constante.</div>`;
      return;
    }

    const years = validEvents.map(e => e.year);
    const minYear = Math.min(...years) - 10;
    const maxYear = Math.max(...years, 2026) + 10;

    // Log10 relative uncertainties
    const logVals = validEvents.map(e => Math.log10(e.relative_uncertainty));
    const minLog = Math.floor(Math.min(...logVals));
    const maxLog = Math.ceil(Math.max(...logVals));

    const scaleX = y => padLeft + ((y - minYear) / (maxYear - minYear)) * (width - padLeft - padRight);
    const scaleY = l => height - padBottom - ((l - minLog) / (maxLog - minLog)) * (height - padTop - padBottom);

    const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    svg.setAttribute("viewBox", `0 0 ${width} ${height}`);
    svg.setAttribute("class", "chist-plot-svg");
    svg.style.width = "100%";
    svg.style.height = "100%";

    // Grid lines for powers of 10
    const gridG = document.createElementNS("http://www.w3.org/2000/svg", "g");

    for (let l = minLog; l <= maxLog; l++) {
      const y = scaleY(l);
      const line = document.createElementNS("http://www.w3.org/2000/svg", "line");
      line.setAttribute("x1", padLeft);
      line.setAttribute("y1", y);
      line.setAttribute("x2", width - padRight);
      line.setAttribute("y2", y);
      line.setAttribute("stroke", "rgba(255, 255, 255, 0.06)");
      gridG.appendChild(line);

      const label = document.createElementNS("http://www.w3.org/2000/svg", "text");
      label.setAttribute("x", padLeft - 10);
      label.setAttribute("y", y + 4);
      label.setAttribute("fill", "#64748b");
      label.setAttribute("font-size", "10px");
      label.setAttribute("font-family", "var(--font-mono)");
      label.setAttribute("text-anchor", "end");
      label.textContent = `10^(${l})`;
      gridG.appendChild(label);
    }
    svg.appendChild(gridG);

    // Trend line
    let pathD = "";
    validEvents.forEach((e, idx) => {
      const x = scaleX(e.year);
      const y = scaleY(Math.log10(e.relative_uncertainty));
      pathD += (idx === 0 ? "M " : " L ") + `${x} ${y}`;
    });

    const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
    path.setAttribute("d", pathD);
    path.setAttribute("fill", "none");
    path.setAttribute("stroke", "#10b981");
    path.setAttribute("stroke-width", "2");
    svg.appendChild(path);

    // Points
    validEvents.forEach(e => {
      const x = scaleX(e.year);
      const y = scaleY(Math.log10(e.relative_uncertainty));

      const circle = document.createElementNS("http://www.w3.org/2000/svg", "circle");
      circle.setAttribute("cx", x);
      circle.setAttribute("cy", y);
      circle.setAttribute("r", "5");
      circle.setAttribute("fill", "#10b981");
      circle.setAttribute("stroke", "#070b14");
      circle.setAttribute("stroke-width", "2");

      const titleEl = document.createElementNS("http://www.w3.org/2000/svg", "title");
      titleEl.textContent = `${e.year}: ${e.authority}\nIncertidumbre Relativa: ${e.relative_uncertainty.toExponential(2)}`;
      circle.appendChild(titleEl);

      svg.appendChild(circle);
    });

    // Exact event indicator (Zero uncertainty)
    const exactEvent = events.find(e => e.type === "definition");
    if (exactEvent) {
      const x = scaleX(exactEvent.year);
      const flag = document.createElementNS("http://www.w3.org/2000/svg", "g");

      const flagLine = document.createElementNS("http://www.w3.org/2000/svg", "line");
      flagLine.setAttribute("x1", x);
      flagLine.setAttribute("y1", padTop);
      flagLine.setAttribute("x2", x);
      flagLine.setAttribute("y2", height - padBottom);
      flagLine.setAttribute("stroke", "#00e5ff");
      flagLine.setAttribute("stroke-dasharray", "4, 3");
      flag.appendChild(flagLine);

      const flagText = document.createElementNS("http://www.w3.org/2000/svg", "text");
      flagText.setAttribute("x", x);
      flagText.setAttribute("y", padTop - 10);
      flagText.setAttribute("fill", "#00e5ff");
      flagText.setAttribute("font-size", "10px");
      flagText.setAttribute("font-weight", "800");
      flagText.setAttribute("text-anchor", "middle");
      flagText.textContent = `★ ${exactEvent.year}: EXACTO (u=0)`;
      flag.appendChild(flagText);

      svg.appendChild(flag);
    }

    const titleText = document.createElementNS("http://www.w3.org/2000/svg", "text");
    titleText.setAttribute("x", padLeft);
    titleText.setAttribute("y", padTop - 10);
    titleText.setAttribute("fill", "#94a3b8");
    titleText.setAttribute("font-size", "11px");
    titleText.setAttribute("font-weight", "700");
    titleText.textContent = "Incertidumbre Relativa Logarítmica log₁₀(u_r)";
    svg.appendChild(titleText);

    this.uncContainer.appendChild(svg);
  }
}

if (typeof window !== "undefined") {
  window.TimelinePlotter = TimelinePlotter;
}

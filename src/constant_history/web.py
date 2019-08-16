from fastapi import FastAPI
from fastapi.responses import HTMLResponse
from fastapi.staticfiles import StaticFiles
import uvicorn
from .api import load
import json

app = FastAPI(title="constant-history API")
history = load()

@app.get("/api/constants")
def get_constants():
    return [c.model_dump() for c in history.get_all_constants()]

@app.get("/api/constants/{constant_id}/timeline")
def get_timeline(constant_id: str):
    events = history.timeline(constant_id)
    return [e.model_dump() for e in events]

@app.get("/", response_class=HTMLResponse)
def get_ui():
    return """
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>constant-history</title>
        <script src="https://cdn.plot.ly/plotly-2.32.0.min.js"></script>
        <style>
            body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif; margin: 0; padding: 20px; color: #333; max-width: 1000px; margin: auto; }
            h1 { font-weight: 600; }
            select { padding: 10px; font-size: 16px; margin-bottom: 20px; }
            #plot-value, #plot-uncertainty { width: 100%; height: 500px; margin-bottom: 40px; }
            .info-panel { background: #f5f5f5; padding: 15px; border-radius: 5px; margin-bottom: 20px; }
        </style>
    </head>
    <body>
        <h1>constant-history</h1>
        <p>A computable history of how physics learned to measure its constants.</p>
        
        <select id="constant-select" onchange="loadConstant()">
            <option value="">Select a constant...</option>
        </select>

        <div id="info" class="info-panel" style="display: none;">
            <h2 id="c-name"></h2>
            <p id="c-desc"></p>
        </div>

        <div id="plot-value"></div>
        <div id="plot-uncertainty"></div>

        <script>
            async function init() {
                const res = await fetch('/api/constants');
                const constants = await res.json();
                const select = document.getElementById('constant-select');
                constants.forEach(c => {
                    const opt = document.createElement('option');
                    opt.value = c.id;
                    opt.textContent = `${c.name} (${c.symbol})`;
                    select.appendChild(opt);
                });
            }

            async function loadConstant() {
                const id = document.getElementById('constant-select').value;
                if(!id) return;

                const resC = await fetch('/api/constants');
                const constants = await resC.json();
                const constant = constants.find(c => c.id === id);
                
                document.getElementById('info').style.display = 'block';
                document.getElementById('c-name').textContent = `${constant.name} (${constant.symbol})`;
                document.getElementById('c-desc').textContent = constant.description;

                const res = await fetch(`/api/constants/${id}/timeline`);
                const events = await res.json();

                const dates = events.map(e => e.date.year + (e.date.month ? (e.date.month-1)/12 : 0));
                const values = events.map(e => parseFloat(e.value));
                const errors = events.map(e => e.uncertainty ? parseFloat(e.uncertainty) : 0);
                const relUnc = events.map(e => e.relative_uncertainty ? parseFloat(e.relative_uncertainty) : null);
                const texts = events.map(e => `${e.type.toUpperCase()}<br>Source: ${e.source_id}`);

                // Value Plot
                const trace1 = {
                    x: dates, y: values, error_y: { type: 'data', array: errors, visible: true },
                    mode: 'markers+lines', type: 'scatter', text: texts, name: 'Value'
                };
                Plotly.newPlot('plot-value', [trace1], {
                    title: 'Value History', xaxis: {title: 'Year'}, yaxis: {title: 'Value'}
                });

                // Uncertainty Plot
                const validRelUncDates = [];
                const validRelUnc = [];
                const validRelUncTexts = [];
                for(let i=0; i<events.length; i++) {
                    if(relUnc[i] !== null && relUnc[i] > 0) {
                        validRelUncDates.push(dates[i]);
                        validRelUnc.push(relUnc[i]);
                        validRelUncTexts.push(texts[i]);
                    }
                }
                const trace2 = {
                    x: validRelUncDates, y: validRelUnc,
                    mode: 'markers+lines', type: 'scatter', text: validRelUncTexts, name: 'Relative Uncertainty'
                };
                Plotly.newPlot('plot-uncertainty', [trace2], {
                    title: 'Relative Uncertainty History (Log Scale)', xaxis: {title: 'Year'}, yaxis: {title: 'Relative Uncertainty', type: 'log'}
                });
            }

            init();
        </script>
    </body>
    </html>
    """

def run_server():
    uvicorn.run("constant_history.web:app", host="127.0.0.1", port=8000, reload=True)

# constant-history

[![GitHub Pages Deployment](https://img.shields.io/badge/GitHub%20Pages-Live%20Demo-2ea44f?style=for-the-badge&logo=github)](https://lorenhey.github.io/constant-history/)
[![Python Version](https://img.shields.io/badge/python-3.10%2B-blue?style=for-the-badge&logo=python)](pyproject.toml)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=for-the-badge)](LICENSE)
[![Metrology: SI 2019](https://img.shields.io/badge/Metrology-SI%202019%20Redefinition-9333ea?style=for-the-badge)](https://lorenhey.github.io/constant-history/)

> **A computable history of how physics learned to measure its constants.**

`constant-history` tracks how the values, uncertainties, and metrological status of fundamental physical constants have changed over time.

Physical constants didn't magically appear with the values we use today. They were estimated, measured, re-measured, debated, corrected, recommended, refined, and—in some cases—finally fixed by definition. This project makes that history visible, interactive, and computable.

---

### 🌐 [Explorá el Visualizador Web Interactivo (GitHub Pages)](https://lorenhey.github.io/constant-history/)

Accedé a la aplicación cliente autónoma con:
- **Evolución Temporal con Barras de Error**: Gráficos SVG interactivos de valor y orden de magnitud de incertidumbre relativa ($\log_{10} u_r$).
- **Máquina del Tiempo Metrológica**: Control deslizante temporal (1790–2026) con política estricta de *no-future-leakage*.
- **Comparador Histórico (Diff)**: Cálculo de variación de valor nominal y factor de mejora de precisión entre dos años cualesquiera.
- **El Nuevo SI (2019)**: Tratado interactivo de las 7 constantes definitorias del Sistema Internacional de Unidades y la balanza de Kibble.
- **CLI Emulator Web**: Emulador de terminal con comandos `show`, `timeline`, `value`, `diff`, `demo`, `help` y `clear`.

---

## Constantes Curadas

| Símbolo | Nombre | Unidades SI | Estado Actual | Primer Hito Histórico |
|---|---|---|---|---|
| **$G$** | Constante de Gravitación de Newton | $\mathrm{m^3 \cdot kg^{-1} \cdot s^{-2}}$ | Medida experimental ($u_r \approx 2.2 \times 10^{-5}$) | Henry Cavendish (1798) |
| **$c$** | Velocidad de la Luz en el Vacío | $\mathrm{m \cdot s^{-1}}$ | **Exacta por definición** (1983) | Ole Rømer (1676) |
| **$h$** | Constante de Planck | $\mathrm{J \cdot s}$ | **Exacta por definición** (2019) | Max Planck (1900) |
| **$e$** | Carga Eléctrica Elemental | $\mathrm{C}$ | **Exacta por definición** (2019) | Robert Millikan (1913) |
| **$k_B$** | Constante de Boltzmann | $\mathrm{J \cdot K^{-1}}$ | **Exacta por definición** (2019) | Max Planck (1900) |
| **$N_A$** | Constante de Avogadro | $\mathrm{mol^{-1}}$ | **Exacta por definición** (2019) | Josef Loschmidt / Perrin (1908) |
| **$\alpha$** | Constante de Estructura Fina | Adimensional | Medida experimental ($u_r \approx 1.5 \times 10^{-10}$) | Arnold Sommerfeld (1916) |

---

## Instalación y CLI en Python

Instalación local con `uv` o `pip`:

```bash
uv pip install -e .
```

### Comandos del CLI (`chist`)

```bash
# Ejecutar demo insignia (historia de G, exactificación de h, time-machine para c)
chist demo

# Cronología de una constante
chist timeline G

# Consulta as-of (máquina del tiempo metrológica)
chist value c --year 1980
chist value c --year 1990

# Comparar evolución de incertidumbre entre dos épocas
chist diff h --from 1986 --to 2019
```

---

## Python API

```python
from constant_history.api import load

history = load()
G = history.get_constant("G")

# Cronología en pandas DataFrame
df = history.timeline_df("G")

# Consulta retrospectiva sin sesgo futuro
c_1980 = history.as_of("c", 1980)
print(f"Velocidad de la luz en 1980: {c_1980.value} +/- {c_1980.uncertainty} {c_1980.unit}")
```

---

## Filosofía Metrológica de los Datos

1. **No future leakage**: Una consulta para 1950 nunca devuelve ajustes o datos publicados a partir de 1951.
2. **Exact vs Measured**: Distinción matemática y conceptual entre incertidumbre cero (definición convencional o fijación en el SI) y precisión experimental ultra alta.
3. **Trazabilidad y Proveniencia**: Cada hito incluye fuente bibliográfica (Cavendish, Birge, DuMond & Cohen, CODATA 1969-2018, CGPM).

---

## Licencia

Distribuido bajo licencia MIT. Datos recopilados a partir de los informes del CODATA Task Group on Fundamental Constants y resoluciones de la CGPM / BIPM.

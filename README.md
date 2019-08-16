# constant-history

> **A computable history of how physics learned to measure its constants.**

`constant-history` tracks how the values, uncertainties, and metrological status of physical constants have changed over time.

Physical constants didn't magically appear with the values we use today. They were estimated, measured, re-measured, debated, corrected, recommended, refined, and—in some cases—finally fixed by definition. This project makes that history visible and computable.

## Features

- **Time Machine (As-Of Queries)**: Find the accepted value of a constant as it was known in any given year.
- **Uncertainty History**: Track how precision improved over decades or centuries.
- **Metrological Status**: Distinguish between experimental measurements, officially recommended values, and defined exact values.
- **The Road to the 2019 SI**: Understand exactly when and how constants like $c$, $h$, $e$, and $k_B$ transitioned from being measured with uncertainty to being exact by definition.

## Installation

You can install it locally using `uv` or `pip`:

```bash
uv pip install -e .
```

## CLI Usage

### The Flagship Demo
Run the demo to see how the project handles the history of $G$, the exactification of $h$, and the time machine for $c$.
```bash
chist demo
```

### Timeline
See the chronological history of a constant:
```bash
chist timeline G
```

### Time Machine (As-Of Query)
What was the accepted speed of light in 1980 vs 1990?
```bash
chist value c --year 1980
chist value c --year 1990
```

### Compare (Diff)
See how much a constant's value and uncertainty changed between two years:
```bash
chist diff h --from 1986 --to 2019
```

## Python API

You can use the python API for your own historical analysis:

```python
from constant_history.api import load

history = load()
G = history.get_constant("G")

# Get timeline as a pandas DataFrame
df = history.timeline_df("G")

# Query as of a specific year
c_1980 = history.as_of("c", 1980)
print(f"Speed of light in 1980: {c_1980.value} +/- {c_1980.uncertainty} {c_1980.unit}")
```

## Web GUI

A lightweight, offline-first web interface is included:

```bash
uv run chist-web
```
This will start a local server at `http://127.0.0.1:8000/`.

## Data Philosophy

- **No future leakage**: A query for 1950 will *never* return data that was published in 1951.
- **Exact vs Measured**: We strictly differentiate between a constant with zero uncertainty (an exact defined value, like $c$ today) and a highly precise measurement.
- **Provenance**: Every data point includes its source.

## License
MIT License. Data is curated from historical physics literature and CODATA reports.

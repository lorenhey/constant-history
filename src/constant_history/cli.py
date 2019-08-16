import typer
from rich.console import Console
from rich.table import Table
from rich.panel import Panel
from rich.columns import Columns
from pathlib import Path
from .corpus import CorpusEngine
from .models import RecommendedValue, DefinitionEvent, Measurement

app = typer.Typer(help="constant-history: A computable history of physical constants.")
console = Console()

DEFAULT_CORPUS_PATH = Path("data/corpus.json")

def get_engine(corpus_path: Path = DEFAULT_CORPUS_PATH) -> CorpusEngine:
    if not corpus_path.exists():
        console.print(f"[red]Error: Corpus file not found at {corpus_path}[/red]")
        raise typer.Exit(1)
    return CorpusEngine(corpus_path)

@app.command()
def show(constant_id: str, corpus_path: Path = DEFAULT_CORPUS_PATH):
    """Show the current status of a constant."""
    engine = get_engine(corpus_path)
    try:
        c = engine.get_constant(constant_id)
    except ValueError as e:
        console.print(f"[red]{e}[/red]")
        raise typer.Exit(1)
        
    events = engine.timeline(constant_id)
    if not events:
        console.print(f"[yellow]No events found for {constant_id}[/yellow]")
        return
        
    latest = events[-1]
    
    console.print(f"[bold cyan]{c.name}[/bold cyan] ({c.symbol})")
    console.print(f"Category: {c.category}")
    console.print(f"{c.description}\n")
    
    if isinstance(latest, DefinitionEvent):
        console.print(f"[bold green]Exact by definition ({latest.authority})[/bold green]")
        console.print(f"Value: {latest.value} {latest.unit}")
    elif isinstance(latest, RecommendedValue):
        console.print(f"[bold yellow]Recommended Value ({latest.edition})[/bold yellow]")
        console.print(f"Value: {latest.value} ± {latest.uncertainty} {latest.unit}")
        console.print(f"Relative uncertainty: {latest.relative_uncertainty}")
    elif isinstance(latest, Measurement):
        console.print(f"[bold blue]Latest Measurement[/bold blue]")
        console.print(f"Value: {latest.value} ± {latest.uncertainty} {latest.unit}")

@app.command()
def timeline(constant_id: str, corpus_path: Path = DEFAULT_CORPUS_PATH):
    """Show the chronological timeline of a constant."""
    engine = get_engine(corpus_path)
    try:
        c = engine.get_constant(constant_id)
    except ValueError as e:
        console.print(f"[red]{e}[/red]")
        raise typer.Exit(1)
        
    events = engine.timeline(constant_id)
    table = Table(title=f"Timeline for {c.name} ({c.symbol})")
    table.add_column("Year")
    table.add_column("Type")
    table.add_column("Value")
    table.add_column("Uncertainty")
    table.add_column("Details")
    
    for ev in events:
        year_str = str(ev.date.year)
        if isinstance(ev, DefinitionEvent):
            table.add_row(year_str, "[green]Definition[/green]", str(ev.value), "[green]EXACT[/green]", ev.authority)
        elif isinstance(ev, RecommendedValue):
            table.add_row(year_str, "[yellow]Recommended[/yellow]", str(ev.value), str(ev.uncertainty), ev.edition)
        elif isinstance(ev, Measurement):
            method = ev.method or ""
            table.add_row(year_str, "[blue]Measurement[/blue]", str(ev.value), str(ev.uncertainty), method)
            
    console.print(table)

@app.command()
def value(constant_id: str, year: int = typer.Option(..., "--year", help="Year to query as-of"), corpus_path: Path = DEFAULT_CORPUS_PATH):
    """Get the accepted value of a constant as of a specific year."""
    engine = get_engine(corpus_path)
    try:
        c = engine.get_constant(constant_id)
    except ValueError as e:
        console.print(f"[red]{e}[/red]")
        raise typer.Exit(1)
        
    ev = engine.as_of(constant_id, year)
    if not ev:
        console.print(f"[yellow]No recommended value found for {constant_id} as of {year}.[/yellow]")
        return
        
    console.print(f"[bold]As of {year}, the accepted value for {c.name} was:[/bold]")
    if isinstance(ev, DefinitionEvent):
        console.print(f"Value: {ev.value} {ev.unit} (Exact, {ev.authority})")
    elif isinstance(ev, RecommendedValue):
        console.print(f"Value: {ev.value} ± {ev.uncertainty} {ev.unit} (from {ev.edition})")

@app.command()
def diff(constant_id: str, start: int = typer.Option(..., "--from", help="Start year"), to: int = typer.Option(..., "--to", help="End year"), corpus_path: Path = DEFAULT_CORPUS_PATH):
    """Compare a constant's value between two historical years."""
    engine = get_engine(corpus_path)
    try:
        c = engine.get_constant(constant_id)
    except ValueError as e:
        console.print(f"[red]{e}[/red]")
        raise typer.Exit(1)
        
    ev_start = engine.as_of(constant_id, start)
    ev_end = engine.as_of(constant_id, to)
    
    if not ev_start:
        console.print(f"[yellow]No recommended value found for {constant_id} as of {start}.[/yellow]")
        return
    if not ev_end:
        console.print(f"[yellow]No recommended value found for {constant_id} as of {to}.[/yellow]")
        return
        
    console.print(f"Comparing [bold cyan]{c.name}[/bold cyan] ({c.symbol}) from {start} to {to}")
    
    def format_ev(ev):
        if isinstance(ev, DefinitionEvent):
            return f"{ev.value} {ev.unit} (EXACT)"
        return f"{ev.value} ± {ev.uncertainty} {ev.unit}"
        
    start_str = format_ev(ev_start)
    end_str = format_ev(ev_end)
    
    table = Table()
    table.add_column("Year")
    table.add_column("Value & Uncertainty")
    table.add_column("Status")
    
    table.add_row(str(start), start_str, "Definition" if isinstance(ev_start, DefinitionEvent) else f"Recommended ({ev_start.edition})")
    table.add_row(str(to), end_str, "Definition" if isinstance(ev_end, DefinitionEvent) else f"Recommended ({ev_end.edition})")
    
    console.print(table)
    
    if ev_start.value != 0:
        rel_diff = abs(ev_end.value - ev_start.value) / abs(ev_start.value)
        console.print(f"Relative shift in value: [bold]{float(rel_diff):.2e}[/bold]")
        
    if isinstance(ev_start, RecommendedValue) and isinstance(ev_end, RecommendedValue):
        if ev_start.relative_uncertainty > 0:
            unc_improvement = float(ev_start.relative_uncertainty / ev_end.relative_uncertainty)
            console.print(f"Uncertainty improved by a factor of [bold green]{unc_improvement:.1f}x[/bold green]")

@app.command()
def demo(corpus_path: Path = DEFAULT_CORPUS_PATH):
    """Run a flagship demo of the project."""
    engine = get_engine(corpus_path)
    
    console.print(Panel("[bold magenta]constant-history[/bold magenta]\nA computable history of how physics learned to measure its constants.", expand=False))
    
    # 1. Timeline of G
    console.print("\n[bold cyan]1. G: two centuries of disagreement[/bold cyan]")
    timeline("G", corpus_path)
    
    # 2. Transition of h
    console.print("\n[bold cyan]2. The exactification of the Planck constant[/bold cyan]")
    diff("h", start=1986, to=2019, corpus_path=corpus_path)
    
    # 3. Time machine c
    console.print("\n[bold cyan]3. Time Machine: Speed of Light in 1980 vs 1990[/bold cyan]")
    console.print("[dim]> chist value c --year 1980[/dim]")
    value("c", year=1980, corpus_path=corpus_path)
    console.print("\n[dim]> chist value c --year 1990[/dim]")
    value("c", year=1990, corpus_path=corpus_path)

@app.command()
def lint(corpus_path: Path = DEFAULT_CORPUS_PATH):
    """Lint the corpus data."""
    engine = get_engine(corpus_path)
    errors = engine.lint()
    if errors:
        console.print(f"[red]Found {len(errors)} issues:[/red]")
        for err in errors:
            console.print(f"- {err}")
        raise typer.Exit(1)
    else:
        console.print("[green]Corpus is healthy![/green]")

def main():
    app()

if __name__ == "__main__":
    main()

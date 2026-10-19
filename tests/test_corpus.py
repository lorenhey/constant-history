import pytest
from pathlib import Path
from constant_history.corpus import CorpusEngine
from constant_history.models import DefinitionEvent, RecommendedValue

CORPUS_PATH = Path(__file__).parent.parent / "data" / "corpus.json"

@pytest.fixture
def engine():
    return CorpusEngine(CORPUS_PATH)

def test_corpus_load_and_constants(engine):
    constants = engine.get_all_constants()
    assert len(constants) >= 5
    ids = [c.id for c in constants]
    assert "G" in ids
    assert "c" in ids
    assert "h" in ids
    assert "e" in ids
    assert "alpha" in ids

def test_corpus_lint(engine):
    errors = engine.lint()
    assert len(errors) == 0, f"Lint errors found in corpus: {errors}"

def test_speed_of_light_time_machine(engine):
    # In 1980, c had uncertainty (CODATA 1973)
    c_1980 = engine.as_of("c", 1980)
    assert c_1980 is not None
    assert isinstance(c_1980, RecommendedValue)
    assert c_1980.uncertainty > 0

    # In 1985, c was exact by definition (17th CGPM 1983)
    c_1985 = engine.as_of("c", 1985)
    assert c_1985 is not None
    assert isinstance(c_1985, DefinitionEvent)
    assert c_1985.exact is True

def test_planck_constant_exactification(engine):
    # Before 2018, h was measured/recommended with uncertainty
    h_2014 = engine.as_of("h", 2014)
    assert h_2014 is not None
    assert isinstance(h_2014, RecommendedValue)

    # In 2019, h became exact by definition (26th CGPM 2018 / 2019 New SI)
    h_2019 = engine.as_of("h", 2019)
    assert h_2019 is not None
    assert isinstance(h_2019, DefinitionEvent)
    assert h_2019.exact is True

def test_timeline_chronological_order(engine):
    for c in engine.get_all_constants():
        events = engine.timeline(c.id)
        years = [e.date.to_float_year() for e in events]
        assert years == sorted(years), f"Events for {c.id} are not sorted chronologically"

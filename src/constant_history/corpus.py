import json
from pathlib import Path
from typing import List, Dict, Optional
from .models import Corpus, Constant, Event, RecommendedValue, Measurement, DefinitionEvent

class CorpusEngine:
    def __init__(self, data_path: Path):
        self.data_path = data_path
        self._corpus = self._load()
        self._constants_map: Dict[str, Constant] = {c.id: c for c in self._corpus.constants}
        self._events_by_constant: Dict[str, List[Event]] = {}
        for ev in self._corpus.events:
            self._events_by_constant.setdefault(ev.constant_id, []).append(ev)
            
        # Sort events by date
        for cid in self._events_by_constant:
            self._events_by_constant[cid].sort(key=lambda e: e.date.to_float_year())

    def _load(self) -> Corpus:
        with open(self.data_path, "r", encoding="utf-8") as f:
            data = json.load(f)
        return Corpus.model_validate(data)

    def get_constant(self, constant_id: str) -> Constant:
        if constant_id not in self._constants_map:
            raise ValueError(f"Constant not found: {constant_id}")
        return self._constants_map[constant_id]
        
    def get_all_constants(self) -> List[Constant]:
        return self._corpus.constants

    def timeline(self, constant_id: str) -> List[Event]:
        """Returns all events for a constant chronologically."""
        return self._events_by_constant.get(constant_id, [])

    def as_of(self, constant_id: str, year: int) -> Optional[Event]:
        """
        Get the accepted/recommended value of a constant as of a given year.
        Strict mode: returns the most recent recommended value or definition event before or during that year.
        Does not leak future data.
        """
        events = self.timeline(constant_id)
        best_event = None
        for ev in events:
            if ev.date.year > year:
                break
            if isinstance(ev, (RecommendedValue, DefinitionEvent)):
                best_event = ev
        return best_event

    def lint(self) -> List[str]:
        errors = []
        # Check IDs
        c_ids = set()
        for c in self._corpus.constants:
            if c.id in c_ids:
                errors.append(f"Duplicate constant id: {c.id}")
            c_ids.add(c.id)
            
        ref_ids = set([r.id for r in self._corpus.references])
        inst_ids = set([i.id for i in self._corpus.institutions])
        
        event_ids = set()
        for e in self._corpus.events:
            if e.id in event_ids:
                errors.append(f"Duplicate event id: {e.id}")
            event_ids.add(e.id)
            if e.constant_id not in c_ids:
                errors.append(f"Event {e.id} references unknown constant {e.constant_id}")
            if e.source_id not in ref_ids:
                errors.append(f"Event {e.id} references unknown source {e.source_id}")
            if isinstance(e, Measurement) and e.institution_id:
                if e.institution_id not in inst_ids:
                    errors.append(f"Measurement {e.id} references unknown institution {e.institution_id}")
                    
        return errors

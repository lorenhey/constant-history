from pathlib import Path
import pandas as pd
from typing import Optional, List
from .corpus import CorpusEngine
from .models import Constant, Event

DEFAULT_CORPUS_PATH = Path(__file__).parent.parent.parent / "data" / "corpus.json"

class HistoryAPI:
    def __init__(self, data_path: Optional[Path] = None):
        self.engine = CorpusEngine(data_path or DEFAULT_CORPUS_PATH)
        
    def get_constant(self, constant_id: str) -> Constant:
        return self.engine.get_constant(constant_id)
        
    def get_all_constants(self) -> List[Constant]:
        return self.engine.get_all_constants()
        
    def timeline(self, constant_id: str) -> List[Event]:
        return self.engine.timeline(constant_id)
        
    def as_of(self, constant_id: str, year: int) -> Optional[Event]:
        return self.engine.as_of(constant_id, year)
        
    def timeline_df(self, constant_id: str) -> pd.DataFrame:
        events = self.timeline(constant_id)
        data = []
        for e in events:
            row = {
                "id": e.id,
                "type": e.type,
                "year": e.date.to_float_year(),
                "value": float(e.value),
                "unit": e.unit,
                "source_id": e.source_id,
            }
            if hasattr(e, "uncertainty") and e.uncertainty is not None:
                row["uncertainty"] = float(e.uncertainty)
                row["relative_uncertainty"] = float(e.relative_uncertainty)
            else:
                row["uncertainty"] = 0.0
                row["relative_uncertainty"] = 0.0
                
            if hasattr(e, "exact"):
                row["exact"] = e.exact
            else:
                row["exact"] = False
                
            data.append(row)
        return pd.DataFrame(data)

def load(data_path: Optional[Path] = None) -> HistoryAPI:
    return HistoryAPI(data_path)

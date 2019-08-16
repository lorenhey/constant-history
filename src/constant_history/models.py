from pydantic import BaseModel, Field, field_validator
from typing import List, Optional, Union, Literal
from decimal import Decimal
import datetime

class Reference(BaseModel):
    id: str
    citation: str
    authors: Optional[List[str]] = None
    year: Optional[int] = None
    doi: Optional[str] = None
    url: Optional[str] = None
    notes: Optional[str] = None

class Institution(BaseModel):
    id: str
    name: str
    country: Optional[str] = None

class DatePrecision(BaseModel):
    year: int
    month: Optional[int] = None
    day: Optional[int] = None

    def to_date(self) -> datetime.date:
        return datetime.date(self.year, self.month or 1, self.day or 1)
        
    def to_float_year(self) -> float:
        if self.month is None:
            return float(self.year)
        if self.day is None:
            return self.year + (self.month - 1) / 12.0
        return self.year + (self.month - 1) / 12.0 + (self.day - 1) / 365.25

class BaseEvent(BaseModel):
    id: str
    type: str
    date: DatePrecision
    constant_id: str
    source_id: str
    notes: Optional[str] = None

class Measurement(BaseEvent):
    type: Literal["measurement"] = "measurement"
    value: Decimal
    unit: str
    uncertainty: Optional[Decimal] = None
    relative_uncertainty: Optional[Decimal] = None
    method: Optional[str] = None
    institution_id: Optional[str] = None
    original_value: Optional[str] = None
    original_unit: Optional[str] = None
    is_superseded: bool = False
    
    @field_validator('uncertainty')
    def check_uncertainty(cls, v):
        if v is not None and v < 0:
            raise ValueError("Uncertainty cannot be negative")
        return v

class RecommendedValue(BaseEvent):
    type: Literal["recommended"] = "recommended"
    authority: str
    edition: str
    value: Decimal
    unit: str
    uncertainty: Decimal
    relative_uncertainty: Decimal
    
    @field_validator('uncertainty')
    def check_uncertainty(cls, v):
        if v < 0:
            raise ValueError("Uncertainty cannot be negative")
        return v

class DefinitionEvent(BaseEvent):
    type: Literal["definition"] = "definition"
    authority: str
    value: Decimal
    unit: str
    exact: Literal[True] = True

Event = Union[Measurement, RecommendedValue, DefinitionEvent]

class Constant(BaseModel):
    id: str
    symbol: str
    name: str
    category: str
    description: str
    aliases: List[str] = []
    
class Corpus(BaseModel):
    constants: List[Constant]
    events: List[Event]
    references: List[Reference]
    institutions: List[Institution]

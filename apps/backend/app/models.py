from typing import Literal
from pydantic import BaseModel, Field, field_validator
class ScanRequest(BaseModel):
    domain: str = Field(min_length=3, max_length=253)
    @field_validator('domain')
    @classmethod
    def normalize(cls, value: str) -> str:
        value=value.strip().lower().removeprefix('https://').removeprefix('http://').split('/')[0].split(':')[0].rstrip('.')
        if '.' not in value or ' ' in value: raise ValueError('Enter a valid domain name')
        return value
class CheckResult(BaseModel):
    category: str; name: str; status: Literal['pass','warning','fail']; message: str; details: dict = {}
class ScanResponse(BaseModel):
    domain: str; score: int; grade: str; checks: list[CheckResult]

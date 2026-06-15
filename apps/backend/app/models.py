from typing import Any, Literal
from pydantic import BaseModel, Field, field_validator
Status=Literal['pass','warning','fail','info','needs_review']; Severity=Literal['low','medium','high','critical']
class ScanRequest(BaseModel):
 domain:str=Field(min_length=3,max_length=253)
 @field_validator('domain')
 @classmethod
 def normalize(cls,v):
  v=v.strip().lower().removeprefix('https://').removeprefix('http://').split('/')[0].split(':')[0].rstrip('.')
  if '.' not in v or ' ' in v: raise ValueError('Enter a valid domain name')
  return v
class CheckResult(BaseModel):
 title:str; category:str; status:Status; severity:Severity; plainEnglishSummary:str; whyItMatters:str; recommendedFix:str; evidence:Any=None
class ScanResponse(BaseModel):
 domain:str; score:int; grade:str; main_risk_summary:str; checks:list[CheckResult]

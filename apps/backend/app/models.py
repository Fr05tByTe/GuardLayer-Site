import json
from typing import Any, Literal
from pydantic import AliasChoices, BaseModel, Field, field_validator, model_validator

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
 id:str='security-check'; title:str; category:Literal['Email protection','Website security']; status:Status; severity:Severity
 plainEnglishSummary:str; whyItMatters:str
 recommendedAction:str=Field(validation_alias=AliasChoices('recommendedAction','recommendedFix','recommended_action','recommended_fix'))
 evidence:list[str]=Field(default_factory=list)
 @field_validator('id','title','plainEnglishSummary','whyItMatters','recommendedAction',mode='before')
 @classmethod
 def no_blank_text(cls,v,info):
  fallbacks={'id':'security-check','title':'Security check','plainEnglishSummary':'This check helps assess your business security posture.','whyItMatters':'This check helps assess your business security posture.','recommendedAction':'Review this item with your IT or website provider.'}
  return v.strip() if isinstance(v,str) and v.strip() else fallbacks[info.field_name]
 @model_validator(mode='after')
 def meaningful_id(self):
  if self.id == 'security-check': self.id=self.title.lower().replace(' ','-')
  return self
 @field_validator('evidence',mode='before')
 @classmethod
 def evidence_as_strings(cls,v:Any):
  if v is None: return []
  if isinstance(v,list): return [str(x) for x in v]
  return [v if isinstance(v,str) else json.dumps(v,sort_keys=True)]
class ScanResponse(BaseModel):
 domain:str; score:int; grade:str; main_risk_summary:str; checks:list[CheckResult]

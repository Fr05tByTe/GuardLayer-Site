import asyncio
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from .config import settings
from .models import ScanRequest, ScanResponse
from .scanners.dns import scan_dns
from .scanners.web import scan_web
from .scoring import calculate_score, grade, main_risk_summary
app=FastAPI(title='GuardLayer Pulse API',version='0.1.0')
app.add_middleware(CORSMiddleware,allow_origins=['http://localhost:5173'],allow_methods=['*'],allow_headers=['*'])
@app.get('/health')
def health(): return {'status':'ok'}
@app.post('/api/scan/domain',response_model=ScanResponse)
async def scan_domain(request: ScanRequest):
    dns_checks,web_checks=await asyncio.gather(scan_dns(request.domain),scan_web(request.domain)); checks=dns_checks+web_checks; score=calculate_score(checks); result=ScanResponse(domain=request.domain,score=score,grade=grade(score),main_risk_summary=main_risk_summary(checks),checks=checks)
    if settings.supabase_url and settings.supabase_service_key:
        try:
            from supabase import create_client
            await asyncio.to_thread(create_client(settings.supabase_url,settings.supabase_service_key).table('domain_scans').insert({'domain':result.domain,'score':score,'grade':result.grade,'results':result.model_dump()}).execute)
        except Exception as exc: raise HTTPException(status_code=503,detail='Scan completed but could not be stored') from exc
    return result

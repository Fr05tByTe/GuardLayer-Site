import asyncio, socket, ssl
from datetime import datetime, timezone
import httpx
from ..models import CheckResult
HEADERS={'strict-transport-security','content-security-policy','x-content-type-options','x-frame-options','referrer-policy'}
ADMIN_PATHS=('/admin','/wp-admin','/administrator')
async def ssl_days(domain: str) -> int | None:
    def inspect():
        try:
            ctx=ssl.create_default_context()
            with socket.create_connection((domain,443),timeout=5) as raw:
                with ctx.wrap_socket(raw,server_hostname=domain) as conn: cert=conn.getpeercert()
            expires=datetime.strptime(cert['notAfter'],'%b %d %H:%M:%S %Y %Z').replace(tzinfo=timezone.utc)
            return (expires-datetime.now(timezone.utc)).days
        except (OSError,ssl.SSLError,KeyError,ValueError): return None
    return await asyncio.to_thread(inspect)
async def scan_web(domain: str) -> list[CheckResult]:
    async with httpx.AsyncClient(timeout=8,follow_redirects=True) as client:
        try: response=await client.get(f'https://{domain}')
        except httpx.HTTPError: response=None
        async def exposed(path):
            try: return (path,(await client.get(f'https://{domain}{path}')).status_code in (200,401,403))
            except httpx.HTTPError: return (path,False)
        paths=await asyncio.gather(*(exposed(p) for p in ADMIN_PATHS))
    days=await ssl_days(domain); missing=sorted(HEADERS-set(k.lower() for k in response.headers)) if response else sorted(HEADERS); found=[p for p,v in paths if v]
    return [CheckResult(category='Website security',name='HTTPS connection',status='pass' if response else 'fail',message='Your website is reachable securely.' if response else 'Make sure your website is available over HTTPS.'),CheckResult(category='Website security',name='SSL certificate expiry',status='pass' if days is not None and days>=30 else ('warning' if days is not None else 'fail'),message=f'Certificate expires in {days} days.' if days is not None else 'We could not verify a valid SSL certificate.',details={'days_remaining':days}),CheckResult(category='Website security',name='Security headers',status='pass' if not missing else 'warning',message='Recommended browser security headers are present.' if not missing else 'Ask your web provider to add missing browser security headers.',details={'missing':missing}),CheckResult(category='Website security',name='Common admin paths',status='warning' if found else 'pass',message='Restrict and protect exposed admin login pages.' if found else 'No common admin paths were exposed.',details={'exposed':found}),CheckResult(category='Website security',name='HTTP status',status='pass' if response and response.status_code<400 else 'fail',message=f'Website returned HTTP {response.status_code}.' if response else 'Website did not respond.')]

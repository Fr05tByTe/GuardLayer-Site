import asyncio, socket, ssl
from datetime import datetime, timezone
import httpx
from ..models import CheckResult

HEADERS={'strict-transport-security','content-security-policy','x-content-type-options','x-frame-options','referrer-policy'}
ADMIN_PATHS=('/wp-admin','/wp-login.php','/admin')

async def ssl_days(domain: str) -> int | None:
    def inspect():
        try:
            ctx=ssl.create_default_context()
            with socket.create_connection((domain,443),timeout=5) as raw:
                with ctx.wrap_socket(raw,server_hosttitle=domain) as conn: cert=conn.getpeercert()
            expires=datetime.strptime(cert['notAfter'],'%b %d %H:%M:%S %Y %Z').replace(tzinfo=timezone.utc)
            return (expires-datetime.now(timezone.utc)).days
        except (OSError,ssl.SSLError,KeyError,ValueError): return None
    return await asyncio.to_thread(inspect)

def ssl_result(days: int | None) -> CheckResult:
    if days is None: status,plainEnglishSummary='needs_review','We could not confirm the SSL certificate expiry date. Ask your website provider to check it.'
    elif days < 0: status,plainEnglishSummary='fail',f'The SSL certificate expired {-days} days ago. Renew it immediately.'
    elif days < 30: status,plainEnglishSummary='warning',f'The SSL certificate expires in {days} days. Renew it as a high priority.'
    elif days <= 60: status,plainEnglishSummary='warning',f'The SSL certificate expires in {days} days. Plan its renewal soon.'
    else: status,plainEnglishSummary='pass',f'The SSL certificate is valid for another {days} days.'
    severity='critical' if days is not None and days < 0 else ('high' if days is not None and days < 30 else 'medium')
    return CheckResult(severity=severity,whyItMatters='This security signal affects business risk.',recommendedFix='Review the finding and take the recommended action.',category='Website security',title='SSL certificate expiry',status=status,plainEnglishSummary=plainEnglishSummary,evidence={'days_remaining':days})

async def scan_web(domain: str) -> list[CheckResult]:
    async with httpx.AsyncClient(timeout=8,follow_redirects=True) as client:
        try: response=await client.get(f'https://{domain}')
        except httpx.HTTPError: response=None
        async def inspect_path(path):
            try: return {'path':path,'status_code':(await client.get(f'https://{domain}{path}')).status_code}
            except httpx.HTTPError: return {'path':path,'status_code':None}
        paths=await asyncio.gather(*(inspect_path(p) for p in ADMIN_PATHS))
    days=await ssl_days(domain); missing=sorted(HEADERS-set(k.lower() for k in response.headers)) if response else sorted(HEADERS)
    exposed=[x['path'] for x in paths if x['status_code'] in (200,401,403)]
    http_status='needs_review' if response and response.status_code==403 else ('pass' if response and response.status_code<400 else 'fail')
    http_plainEnglishSummary='The website returned HTTP 403. It may be safely blocking scanners, so a person should confirm the site works.' if http_status=='needs_review' else (f'The website responded normally with HTTP {response.status_code}.' if http_status=='pass' else 'The website did not respond normally. Ask your website provider to investigate.')
    return [
      CheckResult(severity='medium',whyItMatters='This security signal affects business risk.',recommendedFix='Review the finding and take the recommended action.',category='Website security',title='HTTPS connection',status='pass' if response else 'fail',plainEnglishSummary='The website uses an encrypted HTTPS connection.' if response else 'The website could not be reached securely over HTTPS.'),
      ssl_result(days),
      CheckResult(severity='medium',whyItMatters='This security signal affects business risk.',recommendedFix='Review the finding and take the recommended action.',category='Website security',title='Security headers',status='pass' if not missing else 'warning',plainEnglishSummary='Recommended browser protections are in place.' if not missing else 'Ask your website provider to add the missing browser protections.',evidence={'missing_headers':missing}),
      CheckResult(severity='medium',whyItMatters='This security signal affects business risk.',recommendedFix='Review the finding and take the recommended action.',category='Website security',title='Common admin paths',status='warning' if exposed else 'pass',plainEnglishSummary='Common admin pages may be reachable. Protect them with strong passwords and multi-factor authentication.' if exposed else 'No common admin pages appeared to be exposed.',evidence={'paths_checked':paths,'exposed':exposed}),
      CheckResult(severity='medium',whyItMatters='This security signal affects business risk.',recommendedFix='Review the finding and take the recommended action.',category='Website security',title='HTTP status',status=http_status,plainEnglishSummary=http_plainEnglishSummary,evidence={'status_code':response.status_code if response else None})]

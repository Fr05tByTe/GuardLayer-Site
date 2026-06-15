import asyncio
import dns.resolver
from ..models import CheckResult
async def _records(domain: str, kind: str) -> list[str]:
    def resolve():
        try: return [str(x).strip('"') for x in dns.resolver.resolve(domain, kind, lifetime=5)]
        except (dns.resolver.NoAnswer,dns.resolver.NXDOMAIN,dns.resolver.NoNameservers,dns.exception.Timeout): return []
    return await asyncio.to_thread(resolve)
async def scan_dns(domain: str) -> list[CheckResult]:
    txt,mx,dmarc=await asyncio.gather(_records(domain,'TXT'),_records(domain,'MX'),_records(f'_dmarc.{domain}','TXT'))
    spf=any(x.lower().startswith('v=spf1') for x in txt); has_dmarc=any(x.lower().startswith('v=dmarc1') for x in dmarc)
    return [
      CheckResult(category='Email protection',name='SPF record',status='pass' if spf else 'fail',message='SPF tells receiving mail servers which systems may send email for your domain.' if spf else 'Add an SPF record to reduce email impersonation.'),
      CheckResult(category='Email protection',name='DKIM signing',status='warning',message='Confirm DKIM is enabled with your email provider. It cannot be reliably discovered without a selector.'),
      CheckResult(category='Email protection',name='DMARC policy',status='pass' if has_dmarc else 'fail',message='DMARC is published.' if has_dmarc else 'Add a DMARC record to stop criminals impersonating your email.'),
      CheckResult(category='Email protection',name='MX records',status='pass' if mx else 'warning',message='Mail delivery records were found.' if mx else 'No mail delivery records were found; confirm this domain is not used for email.',details={'records':mx})]

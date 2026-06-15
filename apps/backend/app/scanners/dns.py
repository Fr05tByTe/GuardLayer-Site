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
    spf=any(x.lower().startswith('v=spf1') for x in txt)
    dmarc_record=next((x for x in dmarc if x.lower().startswith('v=dmarc1')),None)
    dmarc_none=bool(dmarc_record and 'p=none' in dmarc_record.lower().replace(' ',''))
    return [
      CheckResult(category='Email protection',name='SPF record',status='pass' if spf else 'fail',message='Authorized email senders are listed in SPF.' if spf else 'Add an SPF record so criminals have a harder time sending email that looks like it came from your business.'),
      CheckResult(category='Email protection',name='DKIM signing',status='needs_review',message='Ask your email provider to confirm DKIM is enabled. A public DKIM check needs the selector supplied by your provider.'),
      CheckResult(category='Email protection',name='DMARC policy',status='warning' if dmarc_none else ('pass' if dmarc_record else 'fail'),message='DMARC is monitoring email but is not yet blocking impersonation.' if dmarc_none else ('DMARC is protecting your domain from email impersonation.' if dmarc_record else 'Add DMARC to help stop criminals sending email that looks like it came from your business.'),details={'record':dmarc_record}),
      CheckResult(category='Email protection',name='MX records',status='pass' if mx else 'info',message='Mail delivery records were found.' if mx else 'No mail delivery records were found. This is normal if the domain is not used for email.',details={'records':mx})]

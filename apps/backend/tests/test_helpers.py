import pytest
from app.models import ScanRequest
from app.scanners import dns

def test_domain_normalization(): assert ScanRequest(domain='https://Example.CO.ZA/path').domain == 'example.co.za'
def test_invalid_domain():
    with pytest.raises(ValueError): ScanRequest(domain='not-a-domain')
@pytest.mark.asyncio
async def test_dns_checks(monkeypatch):
    async def records(domain,kind): return {'TXT':['v=spf1 include:test -all'],'MX':['10 mail.test'], '_DMARC':['v=DMARC1; p=reject']}['TXT' if kind=='TXT' and not domain.startswith('_dmarc') else ('_DMARC' if domain.startswith('_dmarc') else kind)]
    monkeypatch.setattr(dns,'_records',records); results=await dns.scan_dns('example.co.za'); assert [r.status for r in results] == ['pass','warning','pass','pass']
